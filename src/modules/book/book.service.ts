import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { BookRepository } from './book.repository'
import { UserRepository } from '../user/user.repository'
import { status } from 'src/shared/entityStatus.enum'
import { InjectRepository } from '@nestjs/typeorm'
import { ReadBookDto, CreateBookDto, UpdateBookDto } from './dtos'
import { plainToClass } from 'class-transformer'
import { Book } from './book.entity'
import { In } from 'typeorm'
import { RoleType } from '../role/roletype.enum'
import { Role } from '../role/role.entity'
import { User } from '../user/user.entity'

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookRepository)
    private readonly _bookRepository: BookRepository,
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
  ) {}

  async get(bookId: number): Promise<ReadBookDto> {
    if (!bookId) throw new BadRequestException('bookId must be sent')
    const book: Book = await this._bookRepository.findOne(bookId, {
      where: { status: status.ACTIVE },
    })
    if (!bookId) throw new NotFoundException('Book does not exist')
    return plainToClass(ReadBookDto, book)
  }

  async getAll(): Promise<ReadBookDto[]> {
    const books: Book[] = await this._bookRepository.find({
      where: { status: status.ACTIVE },
    })
    return books.map(book => plainToClass(ReadBookDto, book))
  }

  async getBooksByAuthor(authorId: number): Promise<ReadBookDto[]> {
    if (!authorId) throw new BadRequestException('authorId must be sent')
    const books: Book[] = await this._bookRepository.find({
      where: { status: status.ACTIVE, authors: In([authorId]) },
    })

    return books.map(book => plainToClass(ReadBookDto, book))
  }

  async create(book: Partial<CreateBookDto>): Promise<ReadBookDto> {
    const authors: User[] = []

    for (const authorId of book.authors) {
      const authorExist = await this._userRepository.findOne(authorId, {
        where: { status: status.ACTIVE },
      })
      if (!authorExist)
        throw new NotFoundException(
          `There's no an author with this Id: ${authorId}`,
        )

      const isAuthor = authorExist.roles.some(
        (role: Role) => role.name === RoleType.AUTHOR,
      )

      if (!isAuthor)
        throw new UnauthorizedException(
          `This user ${authorId} is not an author`,
        )

      authors.push(authorExist)
    }

    const savedBook: Book = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      authors,
    })

    return plainToClass(ReadBookDto, savedBook)
  }

  async createByAuthor(
    book: Partial<CreateBookDto>,
    authorId: number,
  ): Promise<ReadBookDto> {
    const author = await this._userRepository.findOne(authorId, {
      where: { status: status.ACTIVE },
    })
    if (!author)
      throw new NotFoundException(
        `There's no an author with this Id: ${authorId}`,
      )

    const isAuthor = author.roles.some(
      (role: Role) => role.name === RoleType.AUTHOR,
    )

    if (!isAuthor)
      throw new UnauthorizedException(`This user ${authorId} is not an author`)

    const savedBook: Book = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      author,
    })
    return plainToClass(ReadBookDto, savedBook)
  }

  async update(
    bookId: number,
    book: Partial<UpdateBookDto>,
    authorId: number,
  ): Promise<ReadBookDto> {
    const bookExists = await this._bookRepository.findOne(bookId, {
      where: { status: status.ACTIVE },
    })
    if (!bookExists) throw new NotFoundException(`This book does not exists`)
    const isOwnBook = bookExists.authors.some(author => author.id === authorId)
    if (!isOwnBook)
      throw new UnauthorizedException(`This user isn't the book's author`)
    const updatedBook = await this._bookRepository.update(bookId, book)
    return plainToClass(ReadBookDto, updatedBook)
  }

  async delete(bookId: number): Promise<void> {
    const bookExists = await this._bookRepository.findOne(bookId, {
      where: { status: status.ACTIVE },
    })
    if (!bookExists) throw new NotFoundException(`This book does not exists`)
    await this._bookRepository.update(bookId, { status: status.INACTIVE })
  }
}
