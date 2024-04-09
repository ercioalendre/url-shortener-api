import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/database/prisma/services';
import {
  CreateOneUrlModelInputDto,
  UpdateOneUrlModelInputDto,
} from '@modules/url/dtos/input';
import {
  DeleteOneUrlOutputDto,
  GetOneUrlOutputDto,
  CreateOneUrlModelOutputDto,
  GetManyUrlOutputDto,
  UpdateOneUrlModelOutputDto,
} from '@modules/url/dtos/output';
import { Prisma } from '@prisma/client';
import { SearchParams } from '@src/types';
import { UrlSortableFieldList } from '@modules/url/constants';

@Injectable()
export class UrlPrismaRepository {
  private readonly selectMainData = {
    id: true,
    originalUrl: true,
    shortenedPath: true,
    views: true,
  };

  private readonly selectDataStats = {
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
    softDeletedAt: true,
    softDeletedBy: true,
  };

  constructor(private readonly prismaService: PrismaService) {}

  public async createOne(
    createUrlModelDto: CreateOneUrlModelInputDto,
  ): Promise<CreateOneUrlModelOutputDto> {
    return this.prismaService.url.create({
      data: createUrlModelDto,
      select: {
        ...this.selectMainData,
        ...this.selectDataStats,
      },
    });
  }

  public async getMany(
    searchParams: SearchParams | null = {},
    createdBy?: string | null,
  ): Promise<GetManyUrlOutputDto> {
    const {
      page = 1,
      perPage = 10,
      filterBy = undefined,
      filterValue = undefined,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = searchParams;

    const skip = (page - 1) * perPage;

    const orderBy = {};

    const isSortableField = UrlSortableFieldList.find(
      (sortableField) => sortableField === sortBy,
    );

    const parsedSortBy = isSortableField || 'createdAt';

    orderBy[parsedSortBy] = sortOrder;

    const filters = {
      [filterBy]: filterValue,
      createdBy,
    };

    const urlFoundCount = await this.prismaService.url.count({
      where: filters,
    });

    const urlFoundList = await this.prismaService.url.findMany({
      where: filters,
      orderBy,
      skip,
      take: Number(perPage),
      select: {
        ...this.selectMainData,
        ...this.selectDataStats,
      },
    });

    return {
      data: urlFoundList,
      currentPage: page,
      perPage,
      lastPage: Math.ceil(urlFoundCount / perPage) || 1,
      totalRecords: urlFoundCount,
    };
  }

  public async getOne(
    getOneUrlInputDto: Prisma.UrlWhereInput,
  ): Promise<GetOneUrlOutputDto> {
    return this.prismaService.url.findFirst({
      where: getOneUrlInputDto,
      select: {
        ...this.selectMainData,
        ...this.selectDataStats,
      },
    });
  }

  public async getOneUnique(
    getOneUrlInputDto: Prisma.UrlWhereUniqueInput,
  ): Promise<GetOneUrlOutputDto> {
    return this.prismaService.url.findUnique({
      where: getOneUrlInputDto,
      select: {
        ...this.selectMainData,
        ...this.selectDataStats,
      },
    });
  }

  public async updateOneById(
    id: string,
    updateUrlModelDto: UpdateOneUrlModelInputDto,
  ): Promise<UpdateOneUrlModelOutputDto> {
    return await this.prismaService.url.update({
      where: {
        id,
      },
      data: updateUrlModelDto,
      select: {
        ...this.selectMainData,
        ...this.selectDataStats,
      },
    });
  }

  public async softDeleteOneById(
    id: string,
    softDeletedBy: string,
  ): Promise<DeleteOneUrlOutputDto> {
    return await this.prismaService.url.update({
      where: {
        id,
      },
      data: {
        softDeletedAt: new Date(),
        softDeletedBy,
      },
      select: {
        ...this.selectMainData,
        ...this.selectDataStats,
      },
    });
  }

  public async hardDeleteOneById(id: string): Promise<DeleteOneUrlOutputDto> {
    return await this.prismaService.url.delete({
      where: {
        id,
      },
      select: {
        ...this.selectMainData,
        ...this.selectDataStats,
      },
    });
  }

  public async updateViewsById(
    id: string,
    views: number,
  ): Promise<UpdateOneUrlModelOutputDto> {
    return await this.prismaService.url.update({
      where: {
        id,
      },
      data: {
        views,
      },
      select: {
        ...this.selectMainData,
        ...this.selectDataStats,
      },
    });
  }
}
