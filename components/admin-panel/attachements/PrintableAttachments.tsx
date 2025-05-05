import React from 'react'

interface PrintableAttachmentsPropTypes {
    attachementsData: any;
}

function PrintableAttachments({ attachementsData = [] }: PrintableAttachmentsPropTypes) {
    // Check if there are no attachments
    const noAttachments = attachementsData.length === 0;

    // Categorize attachments
    const pictures = attachementsData.filter((att: any) => att.type?.toLowerCase().includes("picture"));
    const audioFiles = attachementsData.filter((att: any) => att.type?.toLowerCase().includes("audio"));
    const videos = attachementsData.filter((att: any) => att.type?.toLowerCase().includes("video"));
    const documents = attachementsData.filter(
        (att: any) => att.type?.toLowerCase() === "application/pdf" || att.type?.toLowerCase() === "document"
    );
    const others = attachementsData.filter(
        (att: any) =>
            !att.type?.toLowerCase().includes("picture") &&
            !att.type?.toLowerCase().includes("audio") &&
            !att.type?.toLowerCase().includes("video") &&
            att.type?.toLowerCase() !== "application/pdf" &&
            att.type?.toLowerCase() !== "document"
    );

    // Function to determine the attachment type and render accordingly for printing
    const renderPrintableAttachment = (attachment: any) => {
        const { type, file_path, caption } = attachment;
        const lowerCaseType = type ? type.toLowerCase() : "";
        const fileName = file_path.split("/").pop();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
        const fullPath = `${baseUrl}${file_path}`;

        // For images, render the actual image with caption
        if (lowerCaseType.includes("picture")) {
            return (
                <div className="flex flex-col items-center p-2 break-inside-avoid">
                    <img
                        src={fullPath}
                        alt={caption || "Image attachment"}
                        className="max-w-full h-auto max-h-64 object-contain border border-gray-200"
                    />
                    {caption && <p className="mt-2 text-sm text-gray-600 text-center">{caption}</p>}
                    {/* <p className="text-xs text-gray-400 mt-1">{fileName}</p> */}
                </div>
            );
        }

        // For all other types, just show the file path and caption
        return (
            <div className="flex flex-col p-2 break-inside-avoid">
                <div className="flex items-center">
                    {/* File type icon */}
                    <div className="mr-2">
                        {lowerCaseType.includes("video") && (
                            <div className="w-8 h-8 bg-red-100 flex items-center justify-center rounded-full">
                                <span className="text-red-500 text-xs">VIDEO</span>
                            </div>
                        )}
                        {lowerCaseType.includes("audio") && (
                            <div className="w-8 h-8 bg-blue-100 flex items-center justify-center rounded-full">
                                <span className="text-blue-500 text-xs">AUDIO</span>
                            </div>
                        )}
                        {(lowerCaseType === "document" || lowerCaseType === "application/pdf") && (
                            <div className="w-8 h-8 bg-amber-100 flex items-center justify-center rounded-full">
                                <span className="text-amber-500 text-xs">DOC</span>
                            </div>
                        )}
                        {!(lowerCaseType.includes("video") ||
                            lowerCaseType.includes("audio") ||
                            lowerCaseType === "document" ||
                            lowerCaseType === "application/pdf") && (
                                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center rounded-full">
                                    <span className="text-gray-500 text-xs">FILE</span>
                                </div>
                            )}
                    </div>

                    {/* File name and path */}
                    <div className="flex-1">
                        <p className="font-medium text-sm">{fileName}</p>
                        <p className="text-xs text-gray-500 break-all">{fullPath}</p>
                    </div>
                </div>

                {/* Caption */}
                {caption && <p className="mt-2 text-sm text-gray-600 pl-10">{caption}</p>}
            </div>
        );
    };

    // Render a section for each type of attachment
    const renderAttachmentSection = (title: string, items: any) => {
        if (items.length === 0) return null;

        return (
            <div className="mb-6 break-inside-avoid-page">
                <h3 className="text-lg font-semibold mb-2 border-b pb-1">{title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4">
                    {items?.map((attachment: any, index: number) => (
                        <div key={index} className="border rounded p-2">
                            {renderPrintableAttachment(attachment)}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="print-attachments py-4">
            <h2 className="text-xl font-bold mb-4">Attachments</h2>

            {noAttachments ? (
                <p className="text-gray-500 italic">No attachments available</p>
            ) : (
                <div className="space-y-6">
                    {renderAttachmentSection("Pictures", pictures)}
                    {renderAttachmentSection("Audio Files", audioFiles)}
                    {renderAttachmentSection("Videos", videos)}
                    {renderAttachmentSection("Documents", documents)}
                    {renderAttachmentSection("Other Files", others)}
                </div>
            )}
        </div>
    );
};


export default PrintableAttachments