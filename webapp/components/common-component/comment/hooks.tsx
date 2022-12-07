/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axiosClient from "../apis";

export const useFetchCommentByDocumentId = (documentId: string) => {
  const [comments, setComments] = useState<any[]>([]);
  useEffect(() => {
    if (!documentId) {
      setComments([])
      return
    }
    const filter = {
      where: {
        belongToId: documentId,
      },
      include: ['createdBy']
    }
    axiosClient.get(`comments?filter=${JSON.stringify(filter)}`).then(response => setComments(response?.data || []))
  }, [])
  return comments;
}
