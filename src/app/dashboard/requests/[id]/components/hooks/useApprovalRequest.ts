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
  const ensureArray = (data: any) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    return [];
  };

  const [request, setRequest] = useState<BudgetRequest | null>(null);
  const [userInfos, setUserInfo] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [assestDetails, setassestDetails] = useState<any[]>([]);
  const [departments, setDepartments] = useState<EntityInfo[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [businessUnits, setBusinessUnits] = useState<EntityInfo[]>([]);

  const [loading, setLoading] = useState(true);

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

  const [error, setError] = useState<string | null>(null);

  const api = useAxios();

  const getEntityName = useCallback(
    (entityMap: Map<number, EntityInfo>, id: number): string => {
      const entity = entityMap.get(id);
      return entity ? entity.name : "Unknown";
    },
    []
  );

  
  useEffect(() => {
    window.scrollTo(0, 0);
  },[])


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
        // console.log("Fetching user info from:", endpoint);
        const response = await api.get(endpoint);

        setUserInfo(
          Array.isArray(response.data)
            ? response.data[0]
            : response.data?.results?.[0] || response.data
        );
        // console.log("User info loaded:", response.data);

        const designationsRes = await api.get("/designations/");
        setDesignations(ensureArray(designationsRes.data));
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to load user information");
      }
    };

    fetchUserInfo();
  }, [userIdParam, api]);

  // Fetch request data
  useEffect(() => {
    const fetchRequestData = async () => {
      if (!requestId) return;

      try {
        setLoading(true);

        const response = await api.get(`/approval-requests/${requestId}/`);
        const requestData = response.data;

        setRequest(requestData);

        const [
          businessUnitsRes,
          departmentsRes,
          designationsRes,
          usersRes,
        ] = await Promise.all([
          api.get("/business-units/"),
          api.get("/departments/"),
          api.get("/designations/"),
          api.get("/userInfo/"),
        ]);

        const businessUnitsData = ensureArray(businessUnitsRes.data);
        const departmentsData = ensureArray(departmentsRes.data);
        const designationsData = ensureArray(designationsRes.data);

        setBusinessUnits(businessUnitsData);
        setDepartments(departmentsData);
        setDesignations(designationsData);
        setUsers(ensureArray(usersRes.data));

        setBusinessUnitMap(new Map(businessUnitsData.map(u => [u.id, u])));
        setDepartmentMap(new Map(departmentsData.map(d => [d.id, d])));
        setDesignationMap(new Map(designationsData.map(d => [d.id, d])));

        setApprovalLevels(requestData.approval_levels || []);

        setError(null);

      } catch (err) {
        console.error(err);
        setError("Failed to load request data");
      } finally {
        setLoading(false);
      }
    };

    fetchRequestData();

  }, [requestId, api]);


  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!request?.id) return;

      try {
        const response = await api.get(`/chats?form_id=${request.id}`);

        const chats = ensureArray(response.data);

        const mappedComments = chats.map((chat: any) => ({
          id: chat.id,
          author: chat.sender?.name || "Unknown",
          text: chat.message,
          timestamp: chat.timestamp,
          read: chat.read,
          authorId: chat.sender?.id,
        }));

        setComments(mappedComments);

      } catch (error) {
        console.error(error);
      }
    };

    fetchComments();
  }, [request?.id, api]);


  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!request?.id) return;

      try {
        const response = await api.get(`/approval-attachments?form_id=${request.id}`);

        const docs = ensureArray(response.data);

        const mappedDocuments = docs.map((doc: ApiDocument) => ({
          id: doc.id,
          name: doc.file.split("/").pop() || "Document",
          type: doc.type || "Unknown",
          size: formatDate(doc.uploaded_at),
          url: doc.file,
        }));

        setDocuments(mappedDocuments);

      } catch (error) {
        console.error(error);
      }
    };

    fetchDocuments();
  }, [request?.id, api]);


  // Fetch asset details
  useEffect(() => {
    const fetchAssetDetails = async () => {
      if (!request?.id) return;
      
      try {
        const response = await api.get(`/approval-items/?form_id=${request.id}`);
        // console.log("Asset details response:", response);
        setassestDetails(ensureArray(response.data));

      } catch (error: any) {
        console.error("Error fetching asset details:", error?.message);
      }
    };

    fetchAssetDetails();
  }, [request?.id, api]);

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