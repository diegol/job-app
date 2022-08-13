import { Note } from "../entity/Note";
import { Job } from "../entity/Job";
import { UpdateNoteInputDto } from "../notes/dto/update-note-input.dto";
import { CreateNoteInputDto } from "../notes/dto/create-note-input.dto";

import { injectable, inject } from "inversify";
import TYPES from "../types";
import { CreateDataSource } from "../common/data-source";

import { Logger, injectLambdaContext } from "@aws-lambda-powertools/logger";
import {
  ApplicationLoggerInterface,
  CreateDataSourceInterface,
} from "../interfaces";

@injectable()
export class NoteRepository {
  private _createDatasource: CreateDataSource;
  private _applicationLogger: Logger;

  constructor(
    @inject(TYPES.CreateDataSource)
    public createDatasource: CreateDataSourceInterface,
    @inject(TYPES.ApplicationLogger)
    public applicationLogger: ApplicationLoggerInterface
  ) {
    this._createDatasource = createDatasource;
    this._applicationLogger = applicationLogger.getInstance();
  }

  private _getRepository = async () => {
    const dataSource = await this._createDatasource.getDataSource();
    return dataSource.manager.getRepository(Note);
  };

  /**
   * Create a job
   */
  async create(job: Job, noteData: CreateNoteInputDto): Promise<Note> {
    const note = new Note();
    note.description = noteData.description;
    note.job = job;
    const repository = await this._getRepository();

    return repository.save(note);
  }
  /**
   * Get a Note list by jobId
   */
  async findList(jobId: string): Promise<Note[]> {
    console.log("jobId:", jobId);
    const repository = await this._getRepository();
    const query = repository
      .createQueryBuilder("Note")
      .where("jobId= :jobId", { jobId })
      .orderBy("Note_created_at", "DESC");

    console.log(query.getSql());
    return query.getMany();
  }

  async findByNoteId(noteId: string) {
    console.log("noteId", noteId);
    return (await this._getRepository()).findOne({ where: { id: noteId } });
  }

  /**
   * Update a specific note
   */
  async updateNoteByNoteId(noteId: string, noteData: UpdateNoteInputDto) {
    console.log("noteId", noteId);
    return (await this._getRepository())
      .createQueryBuilder()
      .update(Note)
      .set({ description: noteData.description })
      .where("id = :noteId", { noteId })

      .execute();
  }
}
