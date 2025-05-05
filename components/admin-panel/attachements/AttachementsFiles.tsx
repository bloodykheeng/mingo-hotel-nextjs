import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import Link from "next/link";

function AttachementsFiles({ attachementsData }: { attachementsData: any }) {
    console.log("🚀 ~ AttachementsFiles ~ attachementsData:", attachementsData)
    // const attachments = recordDetailData?.project_attachments || [];

    const attachments = attachementsData || [];


    // Check if there are no attachments at all
    const noAttachments = attachments.length === 0;

    // Categorize attachments
    const pictures = attachments.filter((att: any) => att.type?.toLowerCase().includes("picture"));
    const audioFiles = attachments.filter((att: any) => att.type?.toLowerCase().includes("audio"));
    const videos = attachments.filter((att: any) => att.type?.toLowerCase().includes("video"));
    const documents = attachments.filter(
        (att: any) => att.type?.toLowerCase() === "application/pdf" || att.type?.toLowerCase() === "document"
    );
    const others = attachments.filter(
        (att: any) =>
            !att.type?.toLowerCase().includes("picture") &&
            !att.type?.toLowerCase().includes("audio") &&
            !att.type?.toLowerCase().includes("video") &&
            att.type?.toLowerCase() !== "application/pdf" &&
            att.type?.toLowerCase() !== "document"
    );

    // Function to determine the attachment type and render accordingly
    const renderAttachment = (attachment: any) => {
        const { type, file_path, caption } = attachment;
        const lowerCaseType = type ? type.toLowerCase() : "";
        const fileName = file_path.split("/").pop();

        const renderWithCaption = (content: React.ReactNode) => (
            <div className="flex flex-col items-center">
                {content}
                {caption && <p className="mt-2 text-sm text-gray-600">{caption}</p>}
            </div>
        );

        if (lowerCaseType.includes("picture")) {
            return renderWithCaption(
                <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${file_path}`}
                    alt={caption || "Attachment"}
                    width="150"
                    preview
                />
            );
        }

        if (lowerCaseType.includes("video")) {
            return renderWithCaption(
                <video width="320" height="240" controls>
                    <source src={`${process.env.NEXT_PUBLIC_BASE_URL}${file_path}`} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            );
        }

        if (lowerCaseType === "document" || lowerCaseType === "application/pdf") {
            return renderWithCaption(
                <a href={`${process.env.NEXT_PUBLIC_BASE_URL}${file_path}`} target="_blank" rel="noopener noreferrer" download>
                    <Button label={caption || fileName} icon="pi pi-file-pdf" />
                </a>
            );
        }

        if (lowerCaseType.includes("audio")) {
            return renderWithCaption(
                <audio controls>
                    <source src={`${process.env.NEXT_PUBLIC_BASE_URL}${file_path}`} type="audio/mp3" />
                    Your browser does not support the audio tag.
                </audio>
            );
        }

        return renderWithCaption(
            <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}${file_path}`} target="_blank" download>
                <Button label={caption || "Download"} icon="pi pi-download" />
            </Link>
        );
    };

    // Reusable function to render attachment sections
    const renderSection = (header: string, items: any[]) => (
        <AccordionTab header={header}>
            <div className="flex flex-wrap gap-4 justify-center">
                {items.length > 0 ? items.map((att, idx) => <div key={idx}>{renderAttachment(att)}</div>) : <p>No {header.toLowerCase()} available</p>}
            </div>
        </AccordionTab>
    );

    return (
        <div>
            <div className="card" title="Attachments" style={{ marginTop: "1rem", padding: 0 }}>
                <strong>Attachments:</strong>
                {noAttachments ? (
                    <p>No attachments attached</p>
                ) : (
                    <Accordion multiple>
                        {pictures.length > 0 && renderSection("Pictures", pictures)}
                        {audioFiles.length > 0 && renderSection("Audio", audioFiles)}
                        {videos.length > 0 && renderSection("Videos", videos)}
                        {documents.length > 0 && renderSection("Documents", documents)}
                        {others.length > 0 && renderSection("Others", others)}
                    </Accordion>
                )}
            </div>
        </div>
    );
}

export default AttachementsFiles;