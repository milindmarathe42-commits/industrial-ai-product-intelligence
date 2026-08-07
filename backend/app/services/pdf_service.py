import os
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Image,
    Table,
    TableStyle
)


def generate_pdf(result):

    os.makedirs("reports", exist_ok=True)

    filename = f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"

    pdf_path = os.path.join("reports", filename)

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=(8.27 * inch, 11.69 * inch)
    )

    styles = getSampleStyleSheet()

    title_style = styles["Heading1"]
    title_style.alignment = TA_CENTER

    heading_style = styles["Heading2"]

    normal = styles["BodyText"]

    story = []

    # ------------------------------------
    # Title
    # ------------------------------------

    story.append(
        Paragraph(
            "Industrial AI Product Intelligence Platform",
            title_style
        )
    )

    story.append(
        Paragraph(
            "AI Inspection Report",
            heading_style
        )
    )

    story.append(Spacer(1, 20))

    # ------------------------------------
    # Date
    # ------------------------------------

    story.append(
        Paragraph(
            f"<b>Date:</b> {datetime.now()}",
            normal
        )
    )

    story.append(Spacer(1, 15))

    # ------------------------------------
    # Original Image
    # ------------------------------------

    if os.path.exists(result["input_image"]):

        story.append(
            Paragraph(
                "<b>Original Image</b>",
                heading_style
            )
        )

        story.append(Image(result["input_image"], width=4*inch, height=3*inch))

        story.append(Spacer(1, 20))

    # ------------------------------------
    # Detected Image
    # ------------------------------------

    detected = result["output_image"]

    if detected.startswith("outputs/"):
        detected = detected.replace("/", os.sep)

    if os.path.exists(detected):

        story.append(
            Paragraph(
                "<b>Detected Image</b>",
                heading_style
            )
        )

        story.append(Image(detected, width=4*inch, height=3*inch))

        story.append(Spacer(1, 20))

    # ------------------------------------
    # Product Table
    # ------------------------------------

    ai = result["ai_report"]

    data = [

        ["Product", ai["product_name"]],

        ["Brand", ai["brand"]],

        ["Category", ai["category"]],

        ["Condition", ai["condition"]],

        ["Quality Score", str(ai["quality_score"])]

    ]

    table = Table(data, colWidths=[2.5*inch, 3.5*inch])

    table.setStyle(

        TableStyle([

            ("GRID",(0,0),(-1,-1),1,colors.black),

            ("BACKGROUND",(0,0),(0,-1),colors.lightgrey),

            ("FONTNAME",(0,0),(-1,-1),"Helvetica-Bold"),

            ("BOTTOMPADDING",(0,0),(-1,-1),8)

        ])

    )

    story.append(table)

    story.append(Spacer(1,20))

    # ------------------------------------
    # Recommendation
    # ------------------------------------

    story.append(
        Paragraph(
            "<b>Recommendation</b>",
            heading_style
        )
    )

    story.append(
        Paragraph(
            ai["recommendation"],
            normal
        )
    )

    story.append(Spacer(1,20))

    # ------------------------------------
    # Summary
    # ------------------------------------

    story.append(
        Paragraph(
            "<b>AI Summary</b>",
            heading_style
        )
    )

    story.append(
        Paragraph(
            ai["summary"],
            normal
        )
    )

    doc.build(story)

    return pdf_path