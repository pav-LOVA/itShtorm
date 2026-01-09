export type CommentType = {
  id: string,
  date: string,
  text: string,
  likesCount: number,
  dislikesCount: number,
  user: {
    id: string,
    name: string
  }

  userAction?: 'like' | 'dislike' | null;
}

export type CommentsType = {
  allCount: number,
  comments: CommentType[],
}


