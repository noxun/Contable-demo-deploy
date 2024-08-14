"use client";
import "@cyntler/react-doc-viewer/dist/index.css";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
export default function HeritageEvaluationPage() {
  //https://res.cloudinary.com/dm0aq4bey/raw/upload/v1717432529/report/balanceSum.xlsx
  const docs = [
    {
      uri: "https://res.cloudinary.com/dm0aq4bey/raw/upload/v1717432529/report/balanceSum.xlsx",
    },
  ];

  return <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />;
}
