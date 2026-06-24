from __future__ import annotations

import json
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf"
PUBLIC = ROOT / "public" / "portfolio-assets"

NAVY = HexColor("#0F172A")
CARD = HexColor("#1E293B")
SKY = HexColor("#38BDF8")
EMERALD = HexColor("#34D399")
WHITE = HexColor("#F8FAFC")
MUTED = HexColor("#94A3B8")
LINE = HexColor("#334155")


def load(locale: str) -> dict:
    with (ROOT / "src" / "messages" / f"{locale}.json").open(encoding="utf-8") as file:
        return json.load(file)


def page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.setFillColor(SKY)
    canvas.rect(0, A4[1] - 4 * mm, A4[0], 4 * mm, fill=1, stroke=0)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7)
    canvas.drawRightString(A4[0] - 16 * mm, 9 * mm, f"Juan Luis Perez · {doc.page}")
    canvas.restoreState()


def styles():
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle(
            "Name", parent=base["Title"], fontName="Helvetica-Bold", fontSize=28,
            leading=30, textColor=WHITE, spaceAfter=4,
        ),
        "role": ParagraphStyle(
            "Role", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=12,
            leading=15, textColor=SKY, spaceAfter=8,
        ),
        "body": ParagraphStyle(
            "Body", parent=base["Normal"], fontName="Helvetica", fontSize=8.8,
            leading=12.5, textColor=MUTED, alignment=TA_LEFT,
        ),
        "section": ParagraphStyle(
            "Section", parent=base["Heading2"], fontName="Helvetica-Bold", fontSize=11,
            leading=13, textColor=SKY, spaceBefore=8, spaceAfter=5,
        ),
        "job": ParagraphStyle(
            "Job", parent=base["Heading3"], fontName="Helvetica-Bold", fontSize=9.5,
            leading=12, textColor=WHITE, spaceAfter=1,
        ),
        "meta": ParagraphStyle(
            "Meta", parent=base["Normal"], fontName="Helvetica", fontSize=7.5,
            leading=10, textColor=EMERALD, spaceAfter=3,
        ),
        "small": ParagraphStyle(
            "Small", parent=base["Normal"], fontName="Helvetica", fontSize=7.3,
            leading=10, textColor=MUTED,
        ),
    }


def section(title: str, st: dict) -> list:
    return [
        Spacer(1, 2 * mm),
        Paragraph(title.upper(), st["section"]),
        HRFlowable(width="100%", thickness=0.5, color=LINE, spaceAfter=4),
    ]


def build(locale: str):
    data = load(locale)
    is_es = locale == "es"
    st = styles()
    filename = f"CV_Juan_Perez_{locale.upper()}.pdf"
    destination = OUTPUT / filename
    doc = BaseDocTemplate(
        str(destination),
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=16 * mm,
        bottomMargin=14 * mm,
        title=f"Juan Luis Perez - CV ({locale.upper()})",
        author="Juan Luis Perez",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
    doc.addPageTemplates(PageTemplate(id="portfolio", frames=[frame], onPage=page))

    story = [
        Paragraph("JUAN LUIS PEREZ", st["name"]),
        Paragraph(
            "FULL STACK DEVELOPER · SAAS · TRAVEL TECH · ENTERPRISE PLATFORMS",
            st["role"],
        ),
        Paragraph(
            "juanluisperezc1996@gmail.com · +54 9 11 7621 1508 · "
            "github.com/Juanperezc · linkedin.com/in/juan-perez-c",
            st["small"],
        ),
        Spacer(1, 4 * mm),
        Paragraph(data["hero"]["description"], st["body"]),
    ]

    story += section("Perfil profesional" if is_es else "Professional profile", st)
    for paragraph in data["about"]["paragraphs"]:
        story.append(Paragraph(paragraph, st["body"]))
        story.append(Spacer(1, 1.5 * mm))

    story += section("Experiencia" if is_es else "Experience", st)
    for item in data["experience"]["items"]:
        heading = f'{item["role"]} · {item["company"]}'
        meta = f'{item["period"]} · {item["type"]} · {item["location"]}'
        job = [
            Paragraph(heading, st["job"]),
            Paragraph(meta, st["meta"]),
            Paragraph(item["description"], st["body"]),
        ]
        if item["highlight"]:
            job.append(Paragraph(item["highlight"], st["small"]))
        job.append(Paragraph(" · ".join(item["tags"]), st["small"]))
        job.append(Spacer(1, 3 * mm))
        story.append(KeepTogether(job))

    story += section("Proyectos seleccionados" if is_es else "Selected projects", st)
    project_cells = []
    for project in data["projects"][:4]:
        text = (
            f'<b><font color="#F8FAFC">{project["name"]}</font></b><br/>'
            f'<font color="#38BDF8">{project["category"]}</font><br/>'
            f'{project["summary"]}<br/>'
            f'<font color="#94A3B8">{" · ".join(project["tags"])}</font>'
        )
        project_cells.append(Paragraph(text, st["small"]))
    project_table = Table(
        [project_cells[:2], project_cells[2:]],
        colWidths=[doc.width / 2 - 3 * mm] * 2,
        hAlign="LEFT",
    )
    project_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CARD),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.append(project_table)

    story += section("Tecnologías" if is_es else "Technologies", st)
    skill_rows = []
    for group in data["skills"]["groups"]:
        skill_rows.append([
            Paragraph(f'<b><font color="#38BDF8">{group["label"]}</font></b>', st["small"]),
            Paragraph(" · ".join(str(item[0]) for item in group["items"]), st["small"]),
        ])
    skill_table = Table(skill_rows, colWidths=[34 * mm, doc.width - 34 * mm])
    skill_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(skill_table)

    doc.build(story)
    (PUBLIC / filename).write_bytes(destination.read_bytes())


if __name__ == "__main__":
    OUTPUT.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    build("es")
    build("en")
