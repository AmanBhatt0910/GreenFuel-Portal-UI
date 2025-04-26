import { DownloadCloud, Eye, FileText } from "lucide-react";
import React from "react";
import { Document } from "../../type";
import { Button } from "@/components/ui/button";

interface DocumentsListProps {
  documents: Document[];
}

const DocumentsList: React.FC<DocumentsListProps> = React.memo(
  ({ documents }) => {
    if (documents.length === 0) {
      return (
        <div className="text-center py-12 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200">
          <FileText className="h-14 w-14 text-gray-300 mx-auto mb-3 opacity-50" />
          <p className="text-gray-500 font-medium">No documents attached</p>
          <p className="text-gray-400 text-sm mt-1 max-w-md mx-auto">
            Upload supporting documents for this request to provide additional
            information
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => {
          const fullUrl = `http://127.0.0.1:8000${doc.url}`;

          // Choose an icon based on file type
          let DocIcon = FileText;
          if (doc.type?.toLowerCase().includes("pdf")) DocIcon = FileText;
          else if (doc.type?.toLowerCase().includes("image"))
            DocIcon = FileText;
          else if (
            doc.type?.toLowerCase().includes("excel") ||
            doc.type?.toLowerCase().includes("sheet")
          )
            DocIcon = FileText;

          return (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-3 rounded-lg mr-4 shadow-sm">
                  <DocIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    {doc.type} • {doc.size}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-indigo-200 hover:bg-indigo-50 text-indigo-700 rounded-lg shadow-sm"
                  onClick={() => window.open(fullUrl, "_blank")}
                >
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-indigo-200 hover:bg-indigo-50 text-indigo-700 rounded-lg shadow-sm"
                  onClick={async () => {
                    try {
                      const response = await fetch(fullUrl);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = doc.name;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error("Download failed:", error);
                    }
                  }}
                >
                  <DownloadCloud className="h-4 w-4 mr-1" /> Download
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);
export default DocumentsList;
