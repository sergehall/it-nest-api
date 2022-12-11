import { Injectable } from '@nestjs/common';
import { SortOrder } from '../../types/types';

@Injectable()
export class ParseQuery {
  static getPaginationData(query: any) {
    let pageNumber: number = parseInt(<string>query.pageNumber);
    let pageSize: number = parseInt(<string>query.pageSize);
    let searchNameTerm: string = query.searchNameTerm?.toString();
    let searchLoginTerm: string = query.searchLoginTerm?.toString();
    let searchEmailTerm: string = query.searchEmailTerm?.toString();
    let title: string = query.sitle?.toString();
    let userName: string = query.searchName?.toString();
    let searchTitle: string = query.searchTitle?.toString();
    let code: string = query.sode?.toString();
    let confirmationCode: string = query.sonfirmationCode?.toString();
    let sortBy: string = query.sortBy?.toString();
    const querySortDirection: SortOrder = query?.sortDirection;

    if (!searchNameTerm) {
      searchNameTerm = '';
    }
    if (!searchLoginTerm || searchLoginTerm.length === 0) {
      searchLoginTerm = '';
    }
    if (!searchEmailTerm) {
      searchEmailTerm = '';
    }
    if (!confirmationCode) {
      confirmationCode = '';
    }
    if (!code) {
      code = '';
    }
    if (!searchTitle) {
      searchTitle = '';
    }
    if (!title) {
      title = '';
    }
    if (!userName) {
      userName = '';
    }
    if (isNaN(pageNumber)) {
      pageNumber = 1;
    }
    if (isNaN(pageSize)) {
      pageSize = 10;
    }
    if (!sortBy || sortBy.length === 0) {
      sortBy = '';
    }

    let sortDirection: SortOrder = 'desc';
    if (
      [-1, 1, 'descending', 'desc', 'ascending', 'asc'].includes(
        querySortDirection,
      )
    ) {
      sortDirection = querySortDirection;
    }
    if (Number(querySortDirection) === 1) {
      sortDirection = 1;
    }
    return {
      pageNumber: pageNumber,
      pageSize: pageSize,
      searchNameTerm: searchNameTerm,
      title: title,
      userName: userName,
      searchTitle: searchTitle,
      code: code,
      confirmationCode: confirmationCode,
      sortBy: sortBy,
      sortDirection: sortDirection,
      searchLoginTerm: searchLoginTerm,
      searchEmailTerm: searchEmailTerm,
    };
  }
}
