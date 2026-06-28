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

PROFILE = {
    "es": (
        "Desarrollador web full-stack autodidacta y orientado a resultados, con 10+ años participando en todo "
        "el ciclo de vida del software y entregando soluciones IT para organizaciones privadas y públicas. "
        "Trabajo principalmente con JavaScript, PHP, React, Laravel y Node.js, con interés constante en GraphQL, "
        "Machine Learning, AWS y Kubernetes. Busco contribuir a productos de clase mundial junto a equipos "
        "dinámicos, colaborativos y de alto rendimiento."
    ),
    "en": (
        "Self-driven full-stack web developer with 10+ years involved in the whole software development life cycle, "
        "providing IT solutions for private and public organizations using JavaScript, PHP, React, Laravel and Node.js. "
        "Aiming to contribute to building world-class software solutions along with highly performant and dynamic teams. "
        "Very interested in GraphQL, Machine Learning, AWS and Kubernetes."
    ),
}

SKILLS = {
    "es": [
        ("Lenguajes", "Avanzado: PHP, JavaScript, TypeScript. Intermedio: Java, Python. Básico: C#, C, Go, Dart."),
        ("Frameworks y herramientas", "Avanzado: Laravel, Node.js, Next.js, React, Angular, AWS S3, EC2, Route 53, CloudFront. Intermedio: Vue, Express, Nest, Elastic Beanstalk, Git, GitLab, Redis, GitHub, WebSocket, OneSignal. Básico: GraphQL, Cypress, Selenium."),
        ("Bases de datos", "Avanzado: MySQL, PostgreSQL. Intermedio: MongoDB, OracleDB. Básico: IPFS Database."),
        ("Agile y producto", "Scrum, Kanban, estimación, code reviews, refactoring, ownership, comunicación con stakeholders."),
    ],
    "en": [
        ("Programming languages", "Advanced: PHP, JavaScript, TypeScript. Intermediate: Java, Python. Basic: C#, C, Go, Dart."),
        ("Frameworks and tools", "Advanced: Laravel, Node.js, Next.js, React, Angular, AWS S3, EC2, Route 53, CloudFront. Intermediate: Vue, Express, Nest, Elastic Beanstalk, Git, GitLab, Redis, GitHub, WebSocket, OneSignal. Basic: GraphQL, Cypress, Selenium."),
        ("Databases", "Advanced: MySQL, PostgreSQL. Intermediate: MongoDB, OracleDB. Basic: IPFS Database."),
        ("Agile and product", "Scrum, Kanban, estimation, code reviews, refactoring, ownership, stakeholder communication."),
    ],
}

LANGUAGES = {
    "es": [
        ("Español", "Nativo"),
        ("Inglés", "B2 profesional / Intermedio+"),
        ("Francés", "Básico"),
    ],
    "en": [
        ("Spanish", "Native"),
        ("English", "B2 professional / Intermediate+"),
        ("French", "Beginner"),
    ],
}

EDUCATION = {
    "es": [
        ("Universidad Centroccidental Lisandro Alvarado", "Ingeniería en Informática", "Barquisimeto, Lara · Julio 2020"),
    ],
    "en": [
        ("Universidad Centroccidental Lisandro Alvarado", "Computer Engineering", "Barquisimeto, Lara · July 2020"),
    ],
}

CERTIFICATIONS = {
    "es": [
        "Universal React with Next.js - The Ultimate Guide · Udemy · 2021",
        "Scrum Foundation Professional Certificate · Certiprof · 2020",
        "Java Developer · CadiF1 · 2017",
        "PHP Developer · CadiF1 · 2015",
    ],
    "en": [
        "Universal React with Next.js - The Ultimate Guide · Udemy · 2021",
        "Scrum Foundation Professional Certificate · Certiprof · 2020",
        "Java Developer · CadiF1 · 2017",
        "PHP Developer · CadiF1 · 2015",
    ],
}

PROJECTS = {
    "es": [
        (
            "BTC Trade Company · Freelance · Julio 2016",
            "Colaboré con otro backend developer en una herramienta/bot para operaciones de compra y venta de criptomonedas. Stack: Laravel, Vue, Binance.",
        ),
    ],
    "en": [
        (
            "BTC Trade Company · Freelance · July 2016",
            "Worked with another backend developer on a bot/tool for cryptocurrency buy and sell operations. Stack: Laravel, Vue, Binance.",
        ),
    ],
}


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
            "Body", parent=base["Normal"], fontName="Helvetica", fontSize=8.2,
            leading=11.2, textColor=MUTED, alignment=TA_LEFT,
        ),
        "section": ParagraphStyle(
            "Section", parent=base["Heading2"], fontName="Helvetica-Bold", fontSize=11,
            leading=13, textColor=SKY, spaceBefore=6, spaceAfter=4,
        ),
        "job": ParagraphStyle(
            "Job", parent=base["Heading3"], fontName="Helvetica-Bold", fontSize=9.1,
            leading=10.7, textColor=WHITE, spaceAfter=1,
        ),
        "meta": ParagraphStyle(
            "Meta", parent=base["Normal"], fontName="Helvetica", fontSize=7.5,
            leading=9.2, textColor=EMERALD, spaceAfter=2,
        ),
        "small": ParagraphStyle(
            "Small", parent=base["Normal"], fontName="Helvetica", fontSize=7.0,
            leading=9.1, textColor=MUTED,
        ),
        "small_white": ParagraphStyle(
            "SmallWhite", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=7.0,
            leading=9.1, textColor=WHITE,
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
            "FULL STACK DEVELOPER · JAVASCRIPT · PHP · REACT · LARAVEL · NODE.JS",
            st["role"],
        ),
        Paragraph(
            "juanluisperezc1996@gmail.com · +54 9 11 7621 1508 · "
            "github.com/Juanperezc · linkedin.com/in/juan-perez-c",
            st["small"],
        ),
        Spacer(1, 4 * mm),
        Paragraph(PROFILE[locale], st["body"]),
    ]

    story += section("Experiencia" if is_es else "Experience", st)
    for item in data["experience"]["items"]:
        heading = f'{item["role"]} · {item["company"]}'
        meta = f'{item["period"]} · {item["type"]} · {item["location"]}'
        job = [
            Paragraph(heading, st["job"]),
            Paragraph(meta, st["meta"]),
            Paragraph(f'- {item["description"]}', st["body"]),
        ]
        if item["highlight"]:
            job.append(Paragraph(f'- {item["highlight"]}', st["small"]))
        job.append(Paragraph(" · ".join(item["tags"]), st["small"]))
        job.append(Spacer(1, 2 * mm))
        story.append(KeepTogether(job))

    story += section("Proyectos" if is_es else "Projects", st)
    for title, description in PROJECTS[locale]:
        story.append(KeepTogether([
            Paragraph(title, st["job"]),
            Paragraph(f"- {description}", st["body"]),
            Spacer(1, 2 * mm),
        ]))

    story += section("Skills", st)
    skill_rows = []
    for label, items in SKILLS[locale]:
        skill_rows.append([
            Paragraph(f'<b><font color="#38BDF8">{label}</font></b>', st["small"]),
            Paragraph(items, st["small"]),
        ])
    skill_table = Table(skill_rows, colWidths=[34 * mm, doc.width - 34 * mm])
    skill_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(skill_table)

    story += section("Idiomas" if is_es else "Languages", st)
    language_rows = [
        [Paragraph(name, st["small_white"]), Paragraph(level, st["small"])]
        for name, level in LANGUAGES[locale]
    ]
    language_table = Table(language_rows, colWidths=[34 * mm, doc.width - 34 * mm])
    language_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    story.append(language_table)

    story += section("Educación" if is_es else "Education", st)
    for institution, degree, meta in EDUCATION[locale]:
        story.append(KeepTogether([
            Paragraph(institution, st["job"]),
            Paragraph(degree, st["body"]),
            Paragraph(meta, st["small"]),
            Spacer(1, 2 * mm),
        ]))

    story += section("Certificaciones" if is_es else "Certifications", st)
    for certification in CERTIFICATIONS[locale]:
        story.append(Paragraph(f"- {certification}", st["small"]))

    doc.build(story)
    (PUBLIC / filename).write_bytes(destination.read_bytes())


if __name__ == "__main__":
    OUTPUT.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    build("es")
    build("en")
