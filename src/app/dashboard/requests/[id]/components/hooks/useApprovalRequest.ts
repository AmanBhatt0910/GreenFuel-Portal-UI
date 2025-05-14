import { useCallback, useEffect, useState } from "react";
import {
  ApiDocument,
  BudgetRequest,
  Comment,
  Designation,
  Document,
  EntityInfo,
} from "../../type";
import useAxios from "@/app/hooks/use-axios";
import { formatDate } from "../AssetDetailsTable/AssetDetailsTable";

export const useApprovalRequest = (
  requestId?: string,
  userIdParam?: string
) => {
  const [request, setRequest] = useState<BudgetRequest | null>(null);
  const [userInfos, setUserInfo] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [assestDetails, setassestDetails] = useState<any[]>([]);
  const [departments, setDepartments] = useState<EntityInfo[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [businessUnits, setBusinessUnits] = useState<EntityInfo[]>([]);

  const [businessUnitMap, setBusinessUnitMap] = useState<
    Map<number, EntityInfo>
  >(new Map());
  const [departmentMap, setDepartmentMap] = useState<Map<number, EntityInfo>>(
    new Map()
  );
  const [designationMap, setDesignationMap] = useState<
    Map<number, Designation>
  >(new Map());

  const [approvalLevels, setApprovalLevels] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = useAxios();

  const getEntityName = useCallback(
    (entityMap: Map<number, EntityInfo>, id: number): string => {
      const entity = entityMap.get(id);
      return entity ? entity.name : "Unknown";
    },
    []
  );

  const getUserName = useCallback(
    (userId: number): string => {
      const user = users.find((u) => u.id === userId);
      return user ? user.name : "Unknown User";
    },
    [users]
  );

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const endpoint = userIdParam
          ? `/userInfo/${userIdParam}`
          : "/userInfo/";
        console.log("Fetching user info from:", endpoint);
        const response = await api.get(endpoint);

        setUserInfo(response.data);
        console.log("User info loaded:", response.data);

        const designationsRes = await api.get("/designations/");
        setDesignations(designationsRes.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to load user information");
      }
    };

    fetchUserInfo();
  }, [userIdParam]);

  // Fetch request data
  useEffect(() => {
    const fetchRequestData = async () => {
      if (!requestId) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/approval-requests/${requestId}/`);
        console.log("response", response);
        const requestData = response.data;
        setRequest(requestData);

        const [businessUnitsRes, departmentsRes, designationsRes, usersRes] =
          await Promise.all([
            api.get("/business-units/"),
            api.get("/departments/"),
            api.get("/designations/"),
            api.get("/userInfo/"),
          ]);

        const businessUnitsData = businessUnitsRes.data;
        const businessUnitsMapObj = new Map();
        businessUnitsData.forEach((unit: EntityInfo) => {
          businessUnitsMapObj.set(unit.id, unit);
        });
        setBusinessUnitMap(businessUnitsMapObj);
        setBusinessUnits(businessUnitsData);

        const departmentsData = departmentsRes.data;
        const departmentsMapObj = new Map();
        departmentsData.forEach((dept: EntityInfo) => {
          departmentsMapObj.set(dept.id, dept);
        });
        setDepartmentMap(departmentsMapObj);
        setDepartments(departmentsData);

        const designationsData = designationsRes.data;
        const designationsMapObj = new Map();
        designationsData.forEach((desig: Designation) => {
          designationsMapObj.set(desig.id, desig);
        });
        setDesignationMap(designationsMapObj);
        setDesignations(designationsData);

        setUsers(usersRes.data);

        if (requestData.approval_levels) {
          setApprovalLevels(requestData.approval_levels);
        }

        if (requestData.documents) {
          console.log("requestData.documents" , requestData.documents)
          setDocuments(requestData.documents);
        }

        if (requestData.comments) {
          setComments(requestData.comments);
        }

        if (requestData.chatMessages) {
          setChatMessages(requestData.chatMessages);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching request data:", err);
        setError("Failed to load request data");
      } finally {
        setLoading(false);
      }
    };

    fetchRequestData();
  }, [requestId]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!request?.id) return;

      try {
        setLoading(true);

        const response = await api.get(`/chats?form_id=${request.id}`);

        const mappedComments = response.data.map((chat: any) => {
          const authorName = chat.sender?.name || "Unknown";

          return {
            id: chat.id,
            author: authorName,
            text: chat.message,
            timestamp: chat.timestamp,
            read: chat.read,
            authorId: chat.sender?.id,
          };
        });

        if (JSON.stringify(mappedComments) !== JSON.stringify(comments)) {
          setComments(mappedComments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError("Failed to fetch comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [request?.id, comments]);

  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!request?.id) return;

      try {
        setLoading(true);

        const response = await api.get(
          `/approval-attachments?form_id=${request.id}`
        );

        const mappedDocuments = response.data.map((doc: ApiDocument) => ({
          id: doc.id,
          name: doc.file.split("/").pop() || "Document",
          type: doc.type || "Unknown",
          size: formatDate(doc.uploaded_at),
          url: doc.file,
        }));

        console.log("response for doc" , response.data);

        // Only update state if documents have changed
        if (JSON.stringify(mappedDocuments) !== JSON.stringify(documents)) {
          setDocuments(mappedDocuments);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        setError("Failed to fetch documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [request?.id, documents]);

  // Fetch asset details
  useEffect(() => {
    const fetchAssetDetails = async () => {
      if (!request?.id) return;
      
      try {
        const response = await api.get(`/approval-items/?form_id=${request.id}`);
        console.log("Asset details response:", response);
        setassestDetails(response.data);
      } catch (error: any) {
        console.error("Error fetching asset details:", error?.message);
      }
    };

    fetchAssetDetails();
  }, [request?.id]);

  const handleAddComment = useCallback(
    async (commentText: string) => {
      if (!commentText.trim() || !userInfos) return;

      try {
        const commentData = {
          form: requestId,
          sender: userInfos?.id,
          message: commentText,
        };

        const response = await api.post(`/chats/`, commentData);

        const newCommentObj: Comment = {
          id: response.data.id || Date.now(),
          author: userInfos?.name || "You",
          text: commentText,
          timestamp: response.data.timestamp || new Date().toISOString(),
          read: response.data.read || "",
        };

        setComments((prevComments) => [...prevComments, newCommentObj]);
      } catch (err) {
        console.error("Error adding comment:", err);
        setError("Failed to add comment");
      }
    },
    [requestId, userInfos]
  );  

  return {
    request,
    userInfos,
    users,
    comments,
    documents,
    assestDetails,
    departments,
    designations,
    businessUnits,
    approvalLevels,
    chatMessages,
    loading,
    error,
    getEntityName,
    getUserName,
    handleAddComment,
    businessUnitMap,
    departmentMap,
    designationMap,
  };
};