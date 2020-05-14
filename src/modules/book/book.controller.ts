import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { BookService } from './book.service'
import { ReadBookDto, CreateBookDto, UpdateBookDto } from './dtos'
import { Roles } from '../role/decorators/role.decorator'
import { RoleType } from '../role/roletype.enum'
import { RoleGuard } from '../role/guards/role.guard'
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from '../auth/user.decorator'

@Controller('books')
export class BookController {
  constructor(private readonly _bookService: BookService) {}

  @Get()
  getBooks(): Promise<ReadBookDto[]> {
    return this._bookService.getAll()
  }

  @Post()
  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  createBook(@Body() book: Partial<CreateBookDto>): Promise<ReadBookDto> {
    return this._bookService.create(book)
  }

  @Post()
  @Roles(RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  createBookByAuthor(
    @Body() book: Partial<CreateBookDto>,
    @GetUser('id') authorId: number,
  ): Promise<ReadBookDto> {
    return this._bookService.createByAuthor(book, authorId)
  }

  @Get(':bookId')
  getBook(@Param('bookId', ParseIntPipe) bookId: number): Promise<ReadBookDto> {
    return this._bookService.get(bookId)
  }

  @Get('author/:authorId')
  getBooksByAuthor(
    @Param('authorId', ParseIntPipe) authorId: number,
  ): Promise<ReadBookDto[]> {
    return this._bookService.getBooksByAuthor(authorId)
  }

  @Patch(':bookId')
  updateBook(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() book: Partial<UpdateBookDto>,
    @GetUser('id') authorId: number,
  ): Promise<ReadBookDto> {
    return this._bookService.update(bookId, book, authorId)
  }

  @Delete(':bookId')
  deleteBook(@Param('bookId', ParseIntPipe) bookId: number) {
    return this._bookService.delete(bookId)
  }
}
