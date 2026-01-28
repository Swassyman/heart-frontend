
export async function downloadReport(
    propertyId: string,
    role: 'Buyer' | 'Builder' | 'Inspector',
    lang: 'en' | 'ml' = 'en',
    aiAnalysis?: any
) {
    try {
        const res = await fetch('http://localhost:3000/report/generate-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyId, role, lang, aiAnalysis })
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Report generation failed: ${err}`);
        }

        // Handle Blob
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${role}_Report_${propertyId}.pdf`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);

        return true;
    } catch (error) {
        console.error("PDF Download Error:", error);
        alert("Failed to download PDF. Please try again.");
        return false;
    }
}
