import { ObjectId } from 'mongodb';
import { Role } from '../auth/roles/role.enum';

export type SortOrder = -1 | 1 | 'descending' | 'desc' | 'ascending' | 'asc';
export type DtoQueryType = {
  searchNameTerm?: string;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
}[];
export type ConvertFilterType = {
  searchNameTerm?: string;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};
export type ArrayEmptyObjects = object[];
//...............................................Errors
export type ErrorType = {
  message: string;
  field: string;
};
export type ArrayErrorsType = ErrorType[];
//...............................................Pagination Query
export type ReturnObjWithPagination = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsType[] | CommentType[] | BlogsEntityType[] | UserType[];
};
export type QueryPaginationType = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortOrder;
};
export type EntityPaginationType = {
  startIndex: number;
  pageSize: number;
  field: string;
  direction: SortOrder;
};
//...............................................User
export type CreateUserInputModelType = {
  login: string;
  password: string;
  email: string;
};
// export class User {
//   id: string;
//   login: string;
//   email: string;
//   passwordHash: string;
//   createdAt: string;
//   orgId: string;
//   roles: Role;
//   emailConfirmation: {
//     confirmationCode: string;
//     expirationDate: string;
//     isConfirmed: boolean;
//     sentEmail: string[];
//   };
//   registrationData: {
//     ip: string | null;
//     userAgent: string;
//   };
// }
export type UserType = {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  orgId: string;
  roles: Role;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: string;
    isConfirmed: boolean;
    sentEmail: string[];
  };
  registrationData: {
    ip: string | null;
    userAgent: string;
  };
};
// export type UserType = {
//   accountData: {
//     id: string;
//     login: string;
//     email: string;
//     passwordHash: string;
//     createdAt: string;
//   };
//   emailConfirmation: {
//     confirmationCode: string;
//     expirationDate: string;
//     isConfirmed: boolean;
//     sentEmail: string[];
//   };
//   registrationData: {
//     ip: string | null;
//     userAgent: string;
//   };
//   isAdmin: boolean;
//   roles: Role;
// };
export type UserTestOldType = {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};
export type UserTestType = {
  _id: ObjectId;
  accountData: {
    id: string;
    login: string;
    email: string;
    passwordHash: string;
  };
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: string;
    isConfirmed: boolean;
    sentEmail: string[];
  };
  registrationData: {
    ip: string | null;
    userAgent: string;
    createdAt: string;
  };
};
export type DTONewUser = {
  login: string;
  password: string;
  email: string;
  userAgent: string;
  clientIp: string;
};
//...............................................Blogs
export type BlogInputModelType = {
  name: string;
  description: string;
  websiteUrl: string;
};
export type BlogsEntityType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
};
export type ReturnObjBlogType = {
  data: BlogsEntityType | null;
  errorsMessages: ErrorType[];
  resultCode: number;
};
export type DTOBlogsType = {
  pageSize: number;
  startIndex: number;
  field: string;
  direction: SortOrder;
};
//...............................................Posts
export type PostsType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: {
      addedAt: string;
      userId: string;
      login: string;
    }[];
  };
};
export type ReturnObjPostType = {
  data: PostsType | null;
  errorsMessages: ErrorType[];
  resultCode: number;
};
export type DTOPosts = {
  pageSize: number;
  startIndex: number;
  field: string;
  direction: SortOrder;
};
export type DTOFindPostsByBlogId = {
  blogId: string;
  pageSize: number;
  startIndex: number;
  field: string;
  direction: SortOrder;
};
export type DtoPostInputModelType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
export type CreatePostBlogInputModelType = {
  title: string;
  shortDescription: string;
  content: string;
};
export type DTOPost = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
};
//...............................................Comments
export type CommentType = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};
export type CommentsEntityType = {
  postId: string;
  allComments: CommentType[];
};
export type CommentsTypeModel = {
  postId: string;
  allComments: CommentType[];
};
export type ReturnObjCommentType = {
  data: CommentType | null;
  errorsMessages: ErrorType[];
  resultCode: number;
};
export type ContentInputModelType = {
  content: string;
};
//...............................................Emails
export type EmailConfirmCodeType = {
  email: string;
  confirmationCode: string;
  createdAt: string;
};
export type EmailRecoveryCodeType = {
  email: string;
  recoveryCode: string;
  createdAt: string;
};
//...............................................Last10secReq
export type Last10secReq = {
  ip: string;
  createdAt: string;
};

//...............................................Feedbacks
export type Feedback = {
  commentId: string;
  comment: string;
};
export type FeedbacksTypeModel = {
  id: string;
  allFeedbacks: Feedback[];
};
export type ReturnTypeObjectFeedback = {
  data: Feedback[] | null;
  errorsMessages: ErrorType[];
  resultCode: number;
};
//...............................................Devices
export type DevicesSchemaModel = {
  userId: string;
  ip: string;
  title: string;
  lastActiveDate: string;
  expirationDate: string;
  deviceId: string;
};
//...............................................BlackList
export type BlackListRefreshTokenJWT = {
  refreshToken: string;
  expirationDate: string;
};
export type BlackListIPDBType = {
  ip: string;
  addedAt: string;
};
//...............................................likeStatus
export type LikeStatusCommentIdType = {
  commentId: string;
  userId: string;
  likeStatus: string;
  createdAt: string;
};
export type LikeStatusPostsIdType = {
  postId: string;
  userId: string;
  login: string;
  likeStatus: string;
  addedAt: string;
};
export type DTOLikeStatusComm = {
  commentId: string;
  userId: string;
  likeStatus: string;
  createdAt: string;
};
export type DTOLikeStatusPost = {
  postId: string;
  userId: string;
  login: string;
  likeStatus: string;
  addedAt: string;
};
export type LikeInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
};
//...............................................Session
export type SessionTypeArray = {
  ip: string | null;
  title: string | undefined;
  lastActiveDate: string;
  deviceId: string;
}[];
export type SessionDevicesType = {
  userId: string;
  ip: string | null;
  title: string;
  lastActiveDate: string;
  expirationDate: string;
  deviceId: string;
};
export type FilterUpdateDevicesType = {
  userId: string;
  deviceId: string;
};
//...............................................JWT Payload
export type PayloadType = {
  userId: string;
  deviceId: string;
  iat: number;
  exp: number;
};
export type DTOJWT = {
  refreshToken: string;
  expirationDate: string;
};
export type Query = {
  pageNumber: number;
  pageSize: number;
  searchNameTerm: string;
  title: string;
  userName: string;
  searchTitle: string;
  code: string;
  confirmationCode: string;
  sortBy: SortOrder;
  sortDirection: string;
  searchLoginTerm: string;
  searchEmailTerm: string;
};
