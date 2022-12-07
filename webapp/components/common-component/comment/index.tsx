/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useAuth } from "../../authentication/hooks";
import axiosClient from "../apis";
import { useEffect, useState } from "react";
import { Empty } from "antd/es";
import { DateTimeUtils } from "../../shared/utils/number-utils";

export const Comment = ({
  documentId,
}: {documentId: string}) => {
  const [comments, setComments] = useState<any[]>([]);
  const [fetchComment, setFetchComment] = useState<boolean>(false);
  const {currentUser} = useAuth();

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
    axiosClient.get(`comments?filter=${JSON.stringify(filter)}`).then(response => {
      const data = response?.data || [];
      const comments = data.filter((item: any) => !item?.replyToId);
      const replyComments = data.filter((item: any) => !!item?.replyToId);
      setComments(comments.map((item: any) => {
        return {...item, reply: replyComments.filter((comment: any) => comment.replyToId === item?.id)}
      }))
    })
  }, [documentId, fetchComment])

  return (
    <div className={"flex flex-col my-5"}>
      <ViewComment comments={comments} setFetchComment={setFetchComment} productId={documentId} />
      {currentUser?.id && <CommitNewComment documentId={documentId} setFetchComment={setFetchComment}/>}
    </div>
  )
}

export default Comment;

export const ViewComment = ({comments, setFetchComment, productId}: {comments: any[], setFetchComment: any, productId: string}) => {
  if (!comments?.length) return <Empty />
  return (
    <div className={"flex flex-col max-h-72 scroll-smooth overflow-y-scroll "}>
      {comments.map((item: any, i: number) => <CommentItem key={`comment-${i}`} {...{...item, setFetchComment, productId}} />)}
    </div>
  )
}

export const CommitNewComment = ({
  documentId,
  setFetchComment,
  rows = 3,
  replyToId
}: {documentId?: string, setFetchComment?: any, rows?: number, replyToId?: string}) => {
  const authContext = useAuth();
  const currentUser = authContext.currentUser;
  const [content, setContent] = useState<string>('');

  const handleCommitComment = async () => {
    if (!documentId || !currentUser?.id || !content) return;
    await axiosClient.post(`comments`, {
      content,
      belongToId: documentId,
      replyToId
    })
    setContent('')
    setFetchComment((prev: boolean) => !prev)
  }

  return (
    <div className={"relative mt-2"}>
      <Input.TextArea value={content} onChange={(e) => setContent(e?.target?.value)} rows={rows} placeholder={'Nhập bình luận'} />
      <div onClick={handleCommitComment} className={"cursor-pointer absolute right-3 bottom-2"}>
        <SendOutlined/>
      </div>
    </div>
  )
}

export const CommentItem = ({
  content,
  createdBy,
  createdAt,
  id = '',
  setFetchComment,
  productId,
  reply,
}: {
  content?: string, createdBy?: any, createdAt?: string,
  id?: string, setFetchComment?: any, productId?: string,
  reply?: any[]
}) => {
  const [replyId, setReplyId] = useState<string>('');
  const handleReply = () => {
    if (id === replyId) setReplyId('')
    else setReplyId(id)
  }

  if (!content) return null;

  return (
    <div className={'py-1 border-b-2 border-dotted border-gray-200'}>
      <div className={"flex gap-[10px]"}>
        <strong>{createdBy?.name}:</strong>
        <div>{content}</div>
      </div>

      <div className={'text-gray-400 text-[12px] italic'}>{DateTimeUtils.dateConverterToString(createdAt)}</div>
      <div onClick={handleReply} className={"cursor-pointer text-gray-400 text-[12px] hover:underline-offset-1 hover:underline"}>reply</div>

      <div className={"mf-5"}>{reply?.map((item: any, i: number) => {
        return <div key={i} className={'ml-[30px] text-xs mb-1'}>
          <div className={"flex gap-[10px]"}>
            <strong>{item?.createdBy?.name}:</strong>
            <div>{item?.content}</div>
          </div>

          <div className={'text-gray-400 text-[11px] italic'}>{DateTimeUtils.dateConverterToString(item?.createdAt)}</div>
        </div>
      })}</div>

      {replyId === id && <CommitNewComment rows={1} documentId={productId} setFetchComment={setFetchComment} replyToId={id}/>}
    </div>
  )
}
