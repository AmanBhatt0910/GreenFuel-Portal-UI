import { DownloadCloud, Eye, FileText, FileImage, FileSpreadsheet, FileArchive, Film, Music, Code } from "lucide-react";
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
        <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-100 rounded-full opacity-20 animate-pulse"></div>
              <FileText className="relative h-16 w-16 text-indigo-400 mx-auto mb-4" />
            </div>
            <h3 className="text-gray-700 font-semibold text-lg mb-2">No documents attached</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto px-4">
              Upload supporting documents for this request to provide additional information
            </p>
          </div>
        </div>
      );
    }

    // Helper function to get appropriate icon based on file type
    const getDocumentIcon = (type = "") => {
      const t = type.toLowerCase();
      if (t.includes("pdf")) return FileText;
      if (t.includes("image") || t.includes("png") || t.includes("jpg") || t.includes("jpeg")) return FileImage;
      if (t.includes("excel") || t.includes("sheet") || t.includes("csv")) return FileSpreadsheet;
      if (t.includes("zip") || t.includes("rar") || t.includes("tar") || t.includes("7z")) return FileArchive;
      if (t.includes("video") || t.includes("mp4") || t.includes("mov")) return Film;
      if (t.includes("audio") || t.includes("mp3") || t.includes("wav")) return Music;
      if (t.includes("code") || t.includes("json") || t.includes("js") || t.includes("html")) return Code;
      return FileText;
    };

    // Helper function to format file size
    const formatFileSize = (size = "") => {
      return size;
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {documents.map((doc) => {
          const fullUrl = `http://api.sugamgreenfuel.in${doc.url}`;
          const DocIcon = getDocumentIcon(doc.type);
          
          // Generate gradient colors based on file type
          let gradientColors = "from-indigo-100 to-blue-100";
          let iconColor = "text-indigo-600";
          
          if (doc.type?.toLowerCase().includes("image")) {
            gradientColors = "from-pink-100 to-rose-100";
            iconColor = "text-pink-600";
          } else if (doc.type?.toLowerCase().includes("sheet") || doc.type?.toLowerCase().includes("excel")) {
            gradientColors = "from-emerald-100 to-green-100";
            iconColor = "text-emerald-600";
          } else if (doc.type?.toLowerCase().includes("zip") || doc.type?.toLowerCase().includes("archive")) {
            gradientColors = "from-amber-100 to-yellow-100";
            iconColor = "text-amber-600";
          }

          return (
            <div
              key={doc.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center w-full sm:w-auto mb-3 sm:mb-0">
                <div className={`bg-gradient-to-br ${gradientColors} p-3 rounded-lg mr-4 shadow-sm`}>
                  <DocIcon className={`h-6 w-6 ${iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-800 truncate" title={doc.name}>
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {doc.type} • {formatFileSize(doc.size)}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2 w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-indigo-200 hover:bg-indigo-50 text-indigo-700 rounded-lg shadow-sm transition-all duration-200"
                  onClick={() => window.open(fullUrl, "_blank")}
                >
                  <Eye className="h-4 w-4 mr-1.5" /> 
                  <span className="hidden sm:inline">View</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-indigo-200 hover:bg-indigo-50 text-indigo-700 rounded-lg shadow-sm transition-all duration-200"
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
                  <DownloadCloud className="h-4 w-4 mr-1.5" /> 
                  <span className="hidden sm:inline">Download</span>
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