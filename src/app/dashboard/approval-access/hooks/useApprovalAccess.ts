"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useAxios from "@/app/hooks/use-axios";
import { Approver, BusinessUnit, Department, User } from "../types";

export default function useApprovalAccess() {

  const api = useAxios();

  const hasFetched = useRef(false);

  const usersCache = useRef<User[]>([]);
  const departmentsCache = useRef<Record<number, Department[]>>({});

  const [users, setUsers] = useState<User[]>([]);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch users
  const fetchUsers = useCallback(async () => {

    if (usersCache.current.length) {
      setUsers(usersCache.current);
      return usersCache.current;
    }

    const res = await api.get("/userInfo/");
    const data = res.data.results || [];

    const formatted = data.map((u: any) => ({
      id: u.id,
      name: u.name || u.username || `User ${u.id}`,
      email: u.email,
    }));

    usersCache.current = formatted;
    setUsers(formatted);

    return formatted;

  }, [api]);

  // Fetch business units
  const fetchBusinessUnits = useCallback(async () => {

    const res = await api.get("/business-units/");
    setBusinessUnits(res.data);

    return res.data;

  }, [api]);

  // Fetch departments with cache
  const fetchDepartmentsByBU = useCallback(async (buId: number) => {

    if (departmentsCache.current[buId]) {
      return departmentsCache.current[buId];
    }

    const res = await api.get(`/departments/?business_unit=${buId}`);

    departmentsCache.current[buId] = res.data;

    return res.data;

  }, [api]);

  // Fetch approvers
  const fetchApprovers = useCallback(async (
    usersList: User[],
    buList: BusinessUnit[]
  ) => {

    const res = await api.get("/approver/", {
      params: { type: "approver" },
    });

    const approverList = res.data || [];

    // Get unique BU ids
    const uniqueBU = [...new Set(approverList.map((a: any) => a.business_unit))];

    // Fetch departments only once per BU
    await Promise.all(
      uniqueBU.map((buId) => fetchDepartmentsByBU(buId))
    );

    // Flatten department cache
    const allDepartments = Object.values(departmentsCache.current).flat();

    const enriched = approverList.map((approver: any) => ({

      ...approver,

      user_details: usersList.find(u => u.id === approver.user),

      business_unit_details: buList.find(
        bu => bu.id === approver.business_unit
      ),

      department_details: allDepartments.find(
        d => d.id === approver.department
      ),

    }));

    setApprovers(enriched);

  }, [api, fetchDepartmentsByBU]);

  // Main fetch
  const fetchAll = useCallback(async () => {

    if (hasFetched.current) return;

    hasFetched.current = true;

    try {

      setLoading(true);

      const usersList = await fetchUsers();

      const buList = await fetchBusinessUnits();

      await fetchApprovers(usersList, buList);

    }
    finally {
      setLoading(false);
    }

  }, [fetchUsers, fetchBusinessUnits, fetchApprovers]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    users,
    businessUnits,
    approvers,
    loading,
    fetchDepartmentsByBU,
    setApprovers,
  };
}
