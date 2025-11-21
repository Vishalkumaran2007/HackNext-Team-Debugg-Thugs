async function generateSummary() {
    const topic = document.getElementById("topicInput").value;
    const output = document.getElementById("output");

    if (!topic) {
        output.innerText = "Please enter a topic.";
        return;
    }

    output.innerText = "⏳ Generating research summary...";

    const API_KEY = "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";

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
                "X-Title": "AI Research Agent"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3-70b-instruct",
                messages: [
                    { role: "system", content: "You are an autonomous AI research agent." },
                    { role: "user", content: `Research Topic: ${topic}` }
                ]
            })
        });

        const data = await response.json();

        if (!data.choices) {
            output.innerText = "❌ API Error:\n" + JSON.stringify(data, null, 2);
            return;
        }

        output.innerText = data.choices[0].message.content;

    } catch (error) {
        output.innerText = "❌ Error: " + error.message;
    }
}

function downloadDocx() {
    const text = document.getElementById("output").innerText;

    const content =
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
            <w:body>
                <w:p><w:r><w:t>${text}</w:t></w:r></w:p>
            </w:body>
        </w:document>`;

    const blob = new Blob([content], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Research_Report.docx";
    link.click();
}

function downloadPdf() {
    const text = document.getElementById("output").innerText;

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: "pt", format: "a4" });

    const lines = pdf.splitTextToSize(text, 550);
    pdf.text(lines, 30, 40);

    pdf.save("Research_Report.pdf");
}
