"""
Portfolio media preparation pipeline.

Derives web-ready images, poster frames, and short muted video previews from
the Port-full/Portfolio source library into Web/public/. Run from the
project root (Port-full):

    python Web/scripts/prepare_media.py

Rules implemented (BUILD_PLAN section 12):
- Only approved derivatives ever enter public/. Originals are untouched.
- Video previews: H.264 MP4, muted, 6-15s, <=8MB target, +faststart.
- Every video gets a poster image.
- Image targets: hero <=500KB, card <=200KB, gallery <=350KB (inspected, not enforced blindly).
- OG images: 1200x630 center crops of each project cover + a home OG.
"""
import json
import os
import subprocess
import sys
from datetime import date
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent.parent  # Port-full
PORTFOLIO = ROOT / "Portfolio"
WEB = ROOT / "Web"
PUBLIC = WEB / "public"
IMG = PUBLIC / "images" / "projects"
VID = PUBLIC / "videos" / "projects"
DOC = PUBLIC / "resume.pdf"
OG = PUBLIC / "images" / "og"
SCOUT = PUBLIC / "scout"

FFMPEG = "ffmpeg在地上"  # replaced below


def ffmpeg(args, quiet=True):
    kw = dict(capture_output=True, text=True, encoding="utf-8", errors="replace")
    cmd = ["ffmpeg", "-y", "-v", "error"] + args
    r = subprocess.run(cmd, **kw)
    if r.returncode != 0:
        # retry with unofficial pixel-format tolerance for a few buggy sources
        r2 = subprocess.run(
            ["ffmpeg", "-y", "-v", "error", "-strict", "unofficial"] + args[2:], **kw
        )
        if r2.returncode != 0:
            err = (r.stderr or "")[-800:]
            print(err, "\n", (r2.stderr or "")[-800:])
            raise RuntimeError(f"ffmpeg failed: {' '.join(cmd[:8])}...")
    return r


def probe_duration(path):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(path)],
        capture_output=True, text=True,
    )
    return float(json.loads(r.stdout)["format"]["duration"])


def video_preview(src, out, start=0.0, duration=8.0, scale="1920:-2", crf=24):
    out.parent.mkdir(parents=True, exist_ok=True)
    args = ["-an", "-ss", f"{start:.2f}", "-i", str(src), "-t", f"{duration:.2f}",
            "-vf", f"scale={scale}", "-c:v", "libx264", "-crf", str(crf),
            "-preset", "medium", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
            str(out)]
    ffmpeg(args)
    size = out.stat().st_size / 1e6
    print(f"  video {out.relative_to(PUBLIC)}  {duration:.0f}s  {size:.1f}MB")
    return size


def frame(src, out_png, t):
    out_png.parent.mkdir(parents=True, exist_ok=True)
    ffmpeg(["-ss", f"{t:.2f}", "-i", str(src), "-frames:v", "1", str(out_png)])
    return out_png


def save_jpg(png_or_src, out, width, quality=85, crop_ratio=None, flatten=(255, 255, 255)):
    """Crop-to-ratio (>=0 for landscape ratio like 1200/630), resize to width, save JPG."""
    out.parent.mkdir(parents=True, exist_ok=True)
    if isinstance(png_or_src, (str, Path)):
        im = Image.open(png_or_src)
    else:
        im = png_or_src
    im = im.convert("RGB") if im.mode != "RGB" else im.copy()
    if crop_ratio:
        w, h = im.size
        target = crop_ratio
        if w / h > target:  # too wide -> crop width
            nw = int(h * target)
            x = (w - nw) // 2
            im = im.crop((x, 0, x + nw, h))
        else:  # too tall -> crop height (bias slightly toward top since posters/art often sit high)
            nh = int(w / target)
            y = max(0, int((h - nh) * 0.42))
            im = im.crop((0, y, w, y + nh))
    if width and im.width > width:
        im = im.resize((width, int(im.height * width / im.width)), Image.LANCZOS)
    im.save(out, "JPEG", quality=quality, optimize=True, progressive=True)
    kb = out.stat().st_size / 1024
    print(f"  image {out.relative_to(PUBLIC)}  {im.width}x{im.height}  {kb:.0f}KB")
    return im


def main():
    global FFMPEG
    for d in [IMG, VID, OG]:
        d.mkdir(parents=True, exist_ok=True)
    for slug in ["anim-hoodie", "tk-campaign", "pattaya-guide",
                 "blueventure-elearning", "en-kku", "sci-fi-environments"]:
        (IMG / slug).mkdir(parents=True, exist_ok=True)
        (VID / slug).mkdir(parents=True, exist_ok=True)

    A = PORTFOLIO / "01_Short-Form Video"
    B = PORTFOLIO / "02_Long-Form Video"
    C = PORTFOLIO / "03_Motion Graphics & 3D"
    D = PORTFOLIO / "04_Graphic Design"
    tmp = PUBLIC / "tmp_media"
    tmp.mkdir(exist_ok=True)

    manifest = []

    def note(slug, derivative, source):
        manifest.append({"project": slug, "derivative": derivative, "source": str(source)})

    # ------------------------------------------------ Anim Hoodie
    s = "anim-hoodie"
    renders = [A / "AnimHoodie Renders" / n for n in
               ["0001-0100.mp4", "0001-0100(1).mp4", "0001-0100(2).mp4"]]
    pic = C / "Project AnimHoodie (Art toy Concept)" / "Pic"
    concat_list = tmp / "ah_list.txt"
    with open(concat_list, "w", encoding="utf-8") as f:
        for r in renders:
            f.write(f"file '{r.as_posix()}'\n")
    concat_out = VID / s / "preview.mp4"
    args = ["-an", "-f", "concat", "-safe", "0", "-i", str(concat_list),
            "-vf", "scale=1920:-2", "-c:v", "libx264", "-crf", "24", "-preset", "medium",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(concat_out)]
    ffmpeg(args)
    f1 = frame(renders[0], tmp / "ah_hero.png", 2.6)
    save_jpg(f1, IMG / s / "hero.jpg", width=1920, quality=85)
    save_jpg(pic / "final_front.png", IMG / s / "cover.jpg", width=1600, quality=85)
    final_map = {"final_back": "final-back", "final_front": "final-front",
                 "final_side": "final-side", "final_dedtail": "final-detail"}
    for src_name, out_name in final_map.items():
        save_jpg(pic / f"{src_name}.png", IMG / s / f"{out_name}.jpg", width=1600, quality=85)
        note(s, f"images/{s}/{out_name}.jpg", pic / f"{src_name}.png")
    note(s, f"videos/{s}/preview.mp4", "AnimHoodie Renders/*.mp4 (3 turntable renders, concatenated)")
    note(s, f"images/{s}/hero.jpg", renders[0])
    note(s, f"images/{s}/cover.jpg", pic / "final_front.png")

    # ------------------------------------------------ TK campaign
    s = "tk-campaign"
    bor = A / "TK Highlights & Ads" / "B-organic-45Sec_1.mp4"
    video_preview(str(bor), VID / s / "montage.mp4", start=12.0, duration=14.0, crf=27)
    f = frame(bor, tmp / "tk_hero.png", 14.5)
    save_jpg(f, IMG / s / "hero.jpg", width=1920, quality=85)
    save_jpg(frame(bor, tmp / "tk_cover.png", 15.0), IMG / s / "cover.jpg", width=1600, quality=85)
    reel1 = A / "TK Reels" / "Reel_อ้อย ผู้ใหญ่ประสาน_1.mp4"
    reel2 = A / "TK Reels" / "Reel_วิธีฉีด_ยางพารา พี่ทูล.mp4"
    video_preview(str(reel1), VID / s / "reel-1.mp4", start=14.0, duration=10.0, scale="810:1440", crf=25)
    save_jpg(frame(reel1, tmp / "reel1.png", 16.0), IMG / s / "reel-1.jpg", width=810, quality=82)
    video_preview(str(reel2), VID / s / "reel-2.mp4", start=25.0, duration=10.0, scale="810:1440", crf=25)
    save_jpg(frame(reel2, tmp / "reel2.png", 27.0), IMG / s / "reel-2.jpg", width=810, quality=82)
    tk_pics = [
        (D / "TK Promo Graphics" / "รีวิวเกษตรกร" / "Final" / "1.png", "graphic-1.jpg"),
        (D / "TK Promo Graphics" / "โปร 5.5" / "1" / "Artboard 1.png", "graphic-2.jpg"),
        (D / "TK Promo Graphics" / "ยาสีฟัน" / "Final" / "1.png", "graphic-3.jpg"),
        (D / "TK Promo Graphics" / "Partner 26-2-68" / "Bsoil N BOG-26-2-68.png", "graphic-4.jpg"),
    ]
    for src, out in tk_pics:
        save_jpg(src, IMG / s / out, width=1200, quality=85)
        note(s, f"images/{s}/{out}", src)
    note(s, f"videos/{s}/montage.mp4", bor)
    note(s, f"videos/{s}/reel-1.mp4", reel1)
    note(s, f"videos/{s}/reel-2.mp4", reel2)
    note(s, f"images/{s}/cover.jpg", bor)
    note(s, f"images/{s}/hero.jpg", bor)

    # ------------------------------------------------ Pattaya Guide
    s = "pattaya-guide"
    PG = D / "PattayaGuide.Thailand"
    weeks = {
        "W1 Post For 15 - 22 Dec Pattaya": ["1.png", "2.png"],
        "W3 Post for 29 Dec - 4 Jan Pattaya": ["1.png", "10.png"],
        "W7 Post for 26 Jan - 1 Feb": ["1.png", "2.png"],
        "W13 Post for 9 -  15 Mar": ["1.png", "2.png"],
        "W17  Post for 06 - 12 April": ["1.png", "2.png"],
        "W21 Post for 4 - 10 May  2026": ["1.png", "2.png"],
    }
    chosen = {}
    for wk, files in weeks.items():
        chosen[wk] = files
    # cover: W3 fireworks post
    for wk, files in [("W3 Post for 29 Dec - 4 Jan Pattaya", ["1.png"])]:
        save_jpg(PG / wk / files[0], IMG / s / "cover.jpg", width=1200, quality=85)
        note(s, f"images/{s}/cover.jpg", PG / wk / files[0])
    gallery_order = [
        ("W17  Post for 06 - 12 April", "1.png", "post-1"),
        ("W1 Post For 15 - 22 Dec Pattaya", "2.png", "post-2"),
        ("W3 Post for 29 Dec - 4 Jan Pattaya", "10.png", "post-3"),
        ("W7 Post for 26 Jan - 1 Feb", "2.png", "post-4"),
        ("W13 Post for 9 -  15 Mar", "2.png", "post-5"),
        ("W17  Post for 06 - 12 April", "2.png", "post-6"),
        ("W21 Post for 4 - 10 May  2026", "1.png", "post-7"),
        ("W21 Post for 4 - 10 May  2026", "2.png", "post-8"),
    ]
    for wk, fn, out in gallery_order:
        save_jpg(PG / wk / fn, IMG / s / f"{out}.jpg", width=1080, quality=85)
        note(s, f"images/{s}/{out}.jpg", PG / wk / fn)
    # contact sheet: 12 representative posts, 4x3 grid
    tiles_src = []
    for wk, files in weeks.items():
        for fn in files:
            tiles_src.append(PG / wk / fn)
    tw = 300
    cols, rows = 4, 3
    thumbs = []
    for p in tiles_src:
        im = Image.open(p).convert("RGB")
        im.thumbnail((tw, int(tw * 1.25)), Image.LANCZOS)
        thumbs.append(im)
    ch = max(t.height for t in thumbs) + 6
    sheet = Image.new("RGB", (cols * (tw + 12), rows * (ch + 12)), (243, 241, 233))
    for i, t in enumerate(thumbs):
        x = (i % cols) * (tw + 12) + 6
        y = (i // cols) * (ch + 12) + 6
        sheet.paste(t, (x, y))
    d = ImageDraw.Draw(sheet)
    d.rectangle([0, sheet.height - 34, sheet.width, sheet.height], fill=(243, 241, 233))
    tfont = None
    try:
        tfont = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 17)
    except Exception:
        pass
    d.text((12, sheet.height - 27), "Pattaya Guide Thailand — 12 of ≈200 weekly posts across 23 batches (Dec 2025 – May 2026)",
           fill=(69, 64, 64), font=tfont)
    sheet = sheet.resize((1200, int(sheet.height * 1200 / sheet.width)), Image.LANCZOS)
    sheet.save(IMG / s / "contact-sheet.jpg", "JPEG", quality=88, optimize=True, progressive=True)
    print(f"  image images/{s}/contact-sheet.jpg {sheet.width}x{sheet.height}")
    note(s, "images/pattaya-guide/contact-sheet.jpg", "12 representative weekly posts (composed contact sheet)")

    # ------------------------------------------------ BlueVenture
    s = "blueventure-elearning"
    BV = B / "BlueVentureTPA E-Learning"
    lesson13 = BV / "วิชา_กฏหมาย_13_บทเรียน_การประกันภัยค้ำจุนในสัญญาประกันภัย_แก้ไขตามแคนวา1.mp4"
    lesson6 = BV / "วิชา_กฎหมาย_6_บทเรียน_รายการที่มีอยู่ในกรมธรรม์ประกันภัย_26-1-26-.mp4"
    video_preview(str(lesson13), VID / s / "module-preview.mp4", start=28.0, duration=16.0, crf=24)
    save_jpg(frame(lesson13, tmp / "bv_hero.png", 40.0), IMG / s / "hero.jpg", width=1920, quality=85)
    save_jpg(frame(lesson13, tmp / "bv_cover.png", 120.0), IMG / s / "cover.jpg", width=1600, quality=85)
    save_jpg(frame(lesson6, tmp / "bv_f1.png", 120.0), IMG / s / "frame-1.jpg", width=1600, quality=85)
    save_jpg(frame(lesson13, tmp / "bv_f2.png", 600.0), IMG / s / "frame-2.jpg", width=1600, quality=85)
    save_jpg(frame(lesson6, tmp / "bv_f3.png", 10.0), IMG / s / "frame-3.jpg", width=1600, quality=85)
    note(s, f"videos/{s}/module-preview.mp4", lesson13)
    note(s, f"images/{s}/hero.jpg", lesson13)
    for i, (src, t) in enumerate([ (lesson6, 120.0), (lesson13, 600.0), (lesson6, 10.0) ], 1):
        note(s, f"images/{s}/frame-{i}.jpg", src)

    # ------------------------------------------------ EN KKU
    s = "en-kku"
    sport = B / "En KKU Events" / "Sport day 2023.mp4"
    video_preview(str(sport), VID / s / "event-preview.mp4", start=338.0, duration=14.0, crf=25)
    save_jpg(frame(sport, tmp / "sport_hero.png", 350.0), IMG / s / "hero.jpg", width=1920, quality=85)
    en = D / "ENPHOTO"
    cd21 = en / "โพสต์เคาดาวน์ (2021)" / "01-18d-9.00.png"
    cd25_files = sorted((en / "โพสต์เคาดาวน์(2025)").glob("*.png"))
    cd25 = cd25_files[0] if cd25_files else None
    shirt_files = sorted((en / "ออกแบบเสื้อ" ).glob("*.png")) or sorted((en / "ออกแบบเสื้อ").glob("*"))
    shirt = shirt_files[0] if shirt_files else None
    tehchinese = en / "ตรุษจีน66.png"
    save_jpg(cd21, IMG / s / "cover.jpg", width=1600, quality=85)
    save_jpg(cd21, IMG / s / "graphic-1.jpg", width=1200, quality=85)
    if cd25:
        save_jpg(cd25, IMG / s / "graphic-2.jpg", width=1080, quality=85)
    if shirt:
        save_jpg(shirt, IMG / s / "graphic-3.jpg", width=1080, quality=85)
    save_jpg(tehchinese, IMG / s / "graphic-4.jpg", width=1080, quality=85)
    note(s, f"videos/{s}/event-preview.mp4", sport)
    note(s, f"images/{s}/hero.jpg", sport)
    for i, src in enumerate([cd21, cd25, shirt, tehchinese], 1):
        if src:
            note(s, f"images/{s}/graphic-{i}.jpg", src)

    # ------------------------------------------------ Sci-fi environments
    s = "sci-fi-environments"
    SF = C / "3D Scifi Environment"
    remake = SF / "Remake retro.mp4"
    d_remake = min(probe_duration(remake), 8.0)
    video_preview(str(remake), VID / s / "loop-1.mp4", start=0.0, duration=d_remake, crf=24)
    save_jpg(frame(remake, tmp / "sf_hero.png", 6.0), IMG / s / "hero.jpg", width=1600, quality=85)
    abstract = SF / "Abstract Animation Loop.mp4"
    video_preview(str(abstract), VID / s / "loop-2.mp4", start=3.0, duration=10.0, crf=26)
    save_jpg(frame(abstract, tmp / "sf_l2.png", 12.0), IMG / s / "loop-2.jpg", width=1600, quality=85)
    liquid = SF / "Liquid.mp4"
    video_preview(str(liquid), VID / s / "loop-3.mp4", start=0.0, duration=8.34, crf=24)
    save_jpg(frame(liquid, tmp / "sf_l3.png", 6.0), IMG / s / "loop-3.jpg", width=1600, quality=85)
    save_jpg(frame(remake, tmp / "sf_cover.png", 6.0), IMG / s / "cover.jpg", width=1600, quality=85)
    save_jpg(frame(SF / "Tube Looping.mp4", tmp / "sf_still2.png", 2.0), IMG / s / "still-2.jpg", width=1600, quality=85)
    for out_ in [(remake, "cover.jpg"), (SF / "Tube Looping.mp4", "still-2.jpg")]:
        note(s, f"images/{s}/{out_[1]}", out_[0])

    # ------------------------------------------------ Résumé PDF
    resume_src = ROOT / "Natnithichai_Resume.pdf"
    DOC.write_bytes(resume_src.read_bytes())
    print(f"  doc resume.pdf {DOC.stat().st_size/1024:.0f}KB")
    note("-", "resume.pdf", resume_src)

    # ------------------------------------------------ OG images (1200x630 from covers)
    og_sources = {
        "default": IMG / "anim-hoodie" / "cover.jpg",
        "anim-hoodie": IMG / "anim-hoodie" / "cover.jpg",
        "tk-campaign": IMG / "tk-campaign" / "cover.jpg",
        "pattaya-guide": IMG / "pattaya-guide" / "cover.jpg",
        "blueventure-elearning": IMG / "blueventure-elearning" / "cover.jpg",
        "en-kku": IMG / "en-kku" / "cover.jpg",
        "sci-fi-environments": IMG / "sci-fi-environments" / "cover.jpg",
    }
    for name, src in og_sources.items():
        save_jpg(src, OG / f"{name}.jpg", width=1200, quality=82, crop_ratio=1200 / 630)
        note("-", f"images/og/{name}.jpg", src)

    out = WEB / "docs" / "media-manifest.json"
    out.write_text(json.dumps(
        {"generated": str(date.today()), "policy": "derivatives only; originals untouched",
         "items": manifest}, indent=2), encoding="utf-8")
    print(f"manifest -> {out.relative_to(ROOT)}  ({len(manifest)} items)")

    # cleanup tmp previews
    for p in tmp.glob("*"):
        p.unlink()
    tmp.rmdir()


if __name__ == "__main__":
    main()
