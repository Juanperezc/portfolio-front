from __future__ import annotations

import json
from pathlib import Path

from reportlab.pdfbase.pdfmetrics import stringWidth

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Flowable,
    HRFlowable,
    KeepTogether,
    PageBreak,
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
NAME = "Juan Luis Pérez Castillo"

PROFILE = {
    "es": "Full Stack Developer con 10+ años creando productos web para equipos internacionales. Especializado en Laravel, React, TypeScript y Node.js, con experiencia en arquitectura, integraciones, AWS y optimización de plataformas SaaS.",
    "en": "Full Stack Developer with 10+ years building web products for international teams. Specialized in Laravel, React, TypeScript and Node.js, with experience in architecture, integrations, AWS and SaaS platform optimization.",
}

SKILLS = {
    "es": [
        ("Lenguajes", "PHP, JavaScript, TypeScript; Java y Python."),
        ("Frontend y backend", "React, Next.js, Angular, Vue, Laravel, Node.js, REST APIs, GraphQL, WebSocket."),
        ("Datos e infraestructura", "MySQL, PostgreSQL, Redis, MongoDB; AWS (S3, EC2, Route 53, CloudFront), CI/CD, Git."),
        ("Producto y equipo", "Scrum, Kanban, code reviews, refactoring y comunicación con stakeholders."),
    ],
    "en": [
        ("Languages", "PHP, JavaScript, TypeScript; Java and Python."),
        ("Frontend and backend", "React, Next.js, Angular, Vue, Laravel, Node.js, REST APIs, GraphQL, WebSocket."),
        ("Data and infrastructure", "MySQL, PostgreSQL, Redis, MongoDB; AWS (S3, EC2, Route 53, CloudFront), CI/CD, Git."),
        ("Product and teamwork", "Scrum, Kanban, code reviews, refactoring and stakeholder communication."),
    ],
}

# CV summaries stay concise while the portfolio retains the full case descriptions.
EXPERIENCE_SUMMARIES = {
    "es": {
        "92118 Collective": "Desarrollo de la plataforma comunitaria de Coronado: eventos, RSVP, check-in QR, paneles e integraciones con IA.",
        "DevBase": "Migración a Next.js, rediseño de tres módulos React e integración de servicios; code reviews y refactoring.",
        "NexoAbogados.cl / Variacode": "Autenticación Gmail/JWT, optimización de servicios y reestructuración de la aplicación sobre AWS.",
        "Conexa · Globo / Telepizza / Delosi": "APIs REST, mantenimiento de sistemas legacy y soporte productivo; code splitting para Delosi.",
        "Envíamelo": "Nuevas funcionalidades, integraciones de APIs y reCAPTCHA para la plataforma logística.",
        "Zaga System · SmartMarket / ZagaTaxi / ZagaSport": "Publicación iOS de SmartMarket, asignación automática en ZagaTaxi y concurrencia WebSocket en ZagaSport.",
        "ARKITECK": "Librería reutilizable para compartir funcionalidades y acelerar el inicio de la aplicación.",
        "Markdebrand": "Desarrollo y mantenimiento de sitios corporativos administrables con WordPress y MySQL.",
        "PLAYMIX": "Tres meses desarrollando reservas de pádel, matchmaking, pagos con Stripe/Mercadopago y ratings.",
        "WoowUp": "Tres meses en el CRM de retail: CDP, campañas multicanal, integraciones e-commerce y reportes.",
        "Womenly": "Infraestructura AWS, reorganización del proyecto y pipelines CI/CD para estabilizar despliegues.",
        "Hygge5": "Construcción y personalización de sitios WordPress y temas para clientes.",
    },
    "en": {
        "92118 Collective": "Developing Coronado's community platform: events, RSVPs, QR check-in, dashboards and AI integrations.",
        "DevBase": "Next.js migration, redesign of three React modules and service integrations; code reviews and refactoring.",
        "NexoAbogados.cl / Variacode": "Gmail/JWT authentication, service optimization and application restructuring on AWS.",
        "Conexa · Globo / Telepizza / Delosi": "REST APIs, legacy maintenance and production support; code splitting for Delosi.",
        "Envíamelo": "New features, API integrations and reCAPTCHA for the logistics platform.",
        "Zaga System · SmartMarket / ZagaTaxi / ZagaSport": "SmartMarket iOS release, automatic dispatch in ZagaTaxi and WebSocket concurrency in ZagaSport.",
        "ARKITECK": "Reusable library to share functionality and speed up application startup.",
        "Markdebrand": "Corporate website development and maintenance with WordPress and MySQL.",
        "PLAYMIX": "Three months building padel reservations, matchmaking, Stripe/Mercadopago payments and ratings.",
        "WoowUp": "Three months on the retail CRM: CDP, multichannel campaigns, e-commerce integrations and reports.",
        "Womenly": "AWS infrastructure, project restructuring and CI/CD pipelines for reliable deployments.",
        "Hygge5": "WordPress websites and custom themes for clients.",
    },
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


def load(locale: str) -> dict:
    with (ROOT / "src" / "messages" / f"{locale}.json").open(encoding="utf-8") as file:
        return json.load(file)


class LinkLabel(Flowable):
    """Vector icon and visible label share one clickable PDF annotation."""

    def __init__(self, label: str, url: str, icon: str = "web", size: float = 7.5):
        super().__init__()
        self.label, self.url, self.icon, self.size = label, url, icon, size
        self.width = 19 + stringWidth(label, "Helvetica", size)
        self.height = size + 8
        self.paragraph = Paragraph(label, ParagraphStyle(
            "LinkLabel", fontName="Helvetica", fontSize=size,
            leading=size + 2.5, textColor=SKY,
        ))

    def wrap(self, available_width, available_height):
        self.width = min(self.width, available_width)
        _, text_height = self.paragraph.wrap(max(1, self.width - 15), available_height)
        self.height = max(self.size + 8, text_height + 5)
        return self.width, self.height

    def draw(self):
        canvas = self.canv
        canvas.saveState()
        canvas.setStrokeColor(SKY)
        canvas.setFillColor(SKY)
        canvas.setLineWidth(0.8)
        canvas.saveState()
        canvas.translate(0, 2)
        if self.icon == "mail":
            canvas.roundRect(0, 1, 10, 7, 1, stroke=1, fill=0)
            path = canvas.beginPath()
            path.moveTo(0, 8); path.lineTo(5, 4); path.lineTo(10, 8)
            canvas.drawPath(path)
        elif self.icon == "phone":
            path = canvas.beginPath()
            for index, point in enumerate([(1, 9), (3, 9), (4, 6), (3, 5), (5, 3), (6, 4), (9, 3), (9, 1)]):
                (path.moveTo if index == 0 else path.lineTo)(*point)
            path.curveTo(4, 0, 0, 5, 1, 9)
            canvas.drawPath(path)
        elif self.icon == "linkedin":
            canvas.roundRect(0, 0, 10, 10, 1, stroke=0, fill=1)
            canvas.setFillColor(NAVY)
            canvas.setFont("Helvetica-Bold", 8)
            canvas.drawString(1.3, 1.4, "in")
        elif self.icon == "github":
            # Cat mark, ears and stem remain sharp at any PDF zoom level.
            path = canvas.beginPath()
            path.moveTo(2, 7); path.lineTo(2, 10); path.lineTo(4, 8.7)
            path.curveTo(5, 9, 6, 9, 7, 8.7)
            path.lineTo(9, 10); path.lineTo(9, 7)
            path.curveTo(11, 3, 8, 1, 6.5, 1)
            path.lineTo(6.5, -1); path.lineTo(4.5, -1); path.lineTo(4.5, 1)
            path.curveTo(1, 1, 0, 4, 2, 7)
            canvas.drawPath(path, stroke=0, fill=1)
            canvas.arc(0, -0.5, 5, 4, 170, 160)
        else:
            canvas.circle(5, 5, 4.5, stroke=1, fill=0)
            canvas.ellipse(3, 0.5, 7, 9.5, stroke=1, fill=0)
            canvas.line(0.5, 5, 9.5, 5)
        canvas.restoreState()
        canvas.setFont("Helvetica", self.size)
        self.paragraph.drawOn(canvas, 15, 3)
        canvas.linkURL(self.url, (0, 0, self.width, self.height), relative=1, thickness=0)
        canvas.restoreState()


def link_row(links: list[LinkLabel], widths: list[float]) -> Table:
    table = Table([links], colWidths=widths, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ]))
    return table


def page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.setFillColor(SKY)
    canvas.rect(0, A4[1] - 4 * mm, A4[0], 4 * mm, fill=1, stroke=0)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7)
    canvas.drawRightString(A4[0] - 16 * mm, 9 * mm, f"{NAME} · {doc.page}")
    canvas.restoreState()


def styles():
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle(
            "Name", parent=base["Title"], fontName="Helvetica-Bold", fontSize=25,
            leading=28, textColor=WHITE, spaceAfter=4,
        ),
        "role": ParagraphStyle(
            "Role", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=12,
            leading=15, textColor=SKY, spaceAfter=8,
        ),
        "body": ParagraphStyle(
            "Body", parent=base["Normal"], fontName="Helvetica", fontSize=8.2,
            leading=10.2, textColor=MUTED, alignment=TA_LEFT,
        ),
        "section": ParagraphStyle(
            "Section", parent=base["Heading2"], fontName="Helvetica-Bold", fontSize=11,
            leading=13, textColor=SKY, spaceBefore=5, spaceAfter=3, keepWithNext=True,
        ),
        "job": ParagraphStyle(
            "Job", parent=base["Heading3"], fontName="Helvetica-Bold", fontSize=9.1,
            leading=10.2, textColor=WHITE, spaceAfter=1,
        ),
        "meta": ParagraphStyle(
            "Meta", parent=base["Normal"], fontName="Helvetica", fontSize=7.5,
            leading=8.6, textColor=EMERALD, spaceAfter=2,
        ),
        "small": ParagraphStyle(
            "Small", parent=base["Normal"], fontName="Helvetica", fontSize=7.0,
            leading=8.5, textColor=MUTED,
        ),
        "small_white": ParagraphStyle(
            "SmallWhite", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=7.0,
            leading=8.5, textColor=WHITE,
        ),
    }


def section(title: str, st: dict) -> list:
    rule = HRFlowable(width="100%", thickness=0.5, color=LINE, spaceAfter=4)
    rule.keepWithNext = True
    return [
        Spacer(1, 1.5 * mm),
        Paragraph(title.upper(), st["section"]),
        rule,
    ]


def experience_entry(item: dict, st: dict, locale: str, urls: dict[str, str]) -> KeepTogether:
    heading = f'{item["role"]} · {item["company"]}'
    location = item["location"]
    work_type = item["type"].split(" · ")[0]
    meta = " · ".join(dict.fromkeys(part for part in [item["period"], work_type, location] if part)).replace("–", "-")
    job = [
        LinkLabel(heading, urls[item["company"]], size=9.1)
        if item["company"] in urls else Paragraph(heading, st["job"]),
        Paragraph(meta, st["meta"]),
        Paragraph(EXPERIENCE_SUMMARIES[locale].get(item["company"], item["description"]), st["body"]),
    ]
    if item["highlight"]:
        job.append(Paragraph(f'- {item["highlight"]}', st["small"]))
    job.append(Paragraph(" · ".join(item["tags"]), st["small"]))
    job.append(Spacer(1, 1.5 * mm))
    return KeepTogether(job)


def build(locale: str):
    data = load(locale)
    is_es = locale == "es"
    st = styles()
    project_urls = {project["slug"]: project["url"] for project in data["projects"]}
    company_slugs = {
        "92118 Collective": "92118-collective",
        "NexoAbogados.cl / Variacode": "nexo-abogados",
        "Envíamelo": "enviamelo",
        "Zaga System · SmartMarket / ZagaTaxi / ZagaSport": "zaga-system",
        "WoowUp": "woowup",
        "PLAYMIX": "playmix",
    }
    urls = {company: project_urls[slug] for company, slug in company_slugs.items()}
    filename = f"CV_Juan_Perez_{locale.upper()}.pdf"
    destination = OUTPUT / filename
    doc = BaseDocTemplate(
        str(destination),
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=14 * mm,
        bottomMargin=12 * mm,
        title=f"{NAME} - CV ({locale.upper()})",
        author=NAME,
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
    doc.addPageTemplates(PageTemplate(id="portfolio", frames=[frame], onPage=page))

    story = [
        Paragraph(NAME.upper(), st["name"]),
        Paragraph(
            "FULL STACK DEVELOPER · JAVASCRIPT · PHP · REACT · LARAVEL · NODE.JS",
            st["role"],
        ),
        link_row([
            LinkLabel("juanluisperezc1996@gmail.com", "mailto:juanluisperezc1996@gmail.com", "mail"),
            LinkLabel("+54 9 11 7621 1508", "tel:+5491176211508", "phone"),
            LinkLabel("juan-perez.me", "https://juan-perez.me"),
        ], [78 * mm, 57 * mm, doc.width - 135 * mm]),
        link_row([
            LinkLabel("github.com/Juanperezc", "https://github.com/Juanperezc", "github"),
            LinkLabel("linkedin.com/in/juan-perez-c", "https://www.linkedin.com/in/juan-perez-c", "linkedin"),
        ], [78 * mm, doc.width - 78 * mm]),
        Spacer(1, 2 * mm),
        Paragraph(PROFILE[locale], st["body"]),
    ]

    selected_projects = [
        next(project for project in data["projects"] if project["slug"] == slug)
        for slug in ("enviamelo", "nexo-abogados", "justfund")
    ]
    projects_label = "Proyectos profesionales" if is_es else "Professional projects"
    story += [Spacer(1, 2 * mm), Paragraph(projects_label, st["small_white"])]
    story.append(link_row([
        LinkLabel(f'{project["name"]} ({project["year"]})'.replace("–", "-"), project["url"])
        for project in selected_projects
    ], [doc.width / 3] * 3))

    story += section("Experiencia profesional" if is_es else "Professional experience", st)
    for index, item in enumerate(data["experience"]["items"]):
        if index == 8:
            story.append(PageBreak())
            story += section("Experiencia anterior" if is_es else "Earlier experience", st)
        story.append(experience_entry(item, st, locale, urls))

    story += section(data["experience"]["collaborationsTitle"], st)
    for item in data["experience"]["collaborations"]:
        story.append(experience_entry(item, st, locale, urls))

    story += section("Proyecto personal" if is_es else "Personal project", st)
    flight = next(project for project in data["projects"] if project["slug"] == "flightepic")
    story.append(KeepTogether([
        LinkLabel(flight["name"], flight["url"], size=9.1),
        Paragraph(flight["role"], st["meta"]),
        Paragraph(
            "Plataforma personal de búsqueda, pagos y gestión de vuelos hacia y desde Venezuela." if is_es else
            "Personal platform for flight search, payments and booking management to and from Venezuela.",
            st["body"],
        ),
        Paragraph(" · ".join(flight["tags"]), st["small"]),
        Spacer(1, 1.5 * mm),
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
            Spacer(1, 1.5 * mm),
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
