import { injectable, inject } from "inversify";
import TYPES from "../types";

import { Logger } from "@aws-lambda-powertools/logger";
import { Metrics, MetricUnits } from "@aws-lambda-powertools/metrics";

/*** interfaces ***/
import {
  ApplicationLoggerInterface,
  ApplicationMetricsInterface,
  JobRepositoryInterface,
  NoteRepositoryInterface,
  NoteServiceInterface,
} from "../interfaces";

//**** DTOs ****/
import { CreateNoteInputDto } from "./dto/create-note-input.dto";
import { UpdateNoteInputDto } from "./dto/update-note-input.dto";

import { Note } from "../entity/Note";

@injectable()
export class NoteService implements NoteServiceInterface {
  private _noteRepository: NoteRepositoryInterface;
  private _jobRepository: JobRepositoryInterface;
  private _logger: Logger;
  private _metrics: Metrics;

  /**
   * Injecting dependencies
   */
  constructor(
    @inject(TYPES.JobRepository)
    jobRepository: JobRepositoryInterface,
    @inject(TYPES.NoteRepository)
    noteRepository: NoteRepositoryInterface,
    @inject(TYPES.ApplicationLogger)
    applicationLogger: ApplicationLoggerInterface,
    @inject(TYPES.ApplicationMetrics)
    applicationMetrics: ApplicationMetricsInterface
  ) {
    this._noteRepository = noteRepository;
    this._jobRepository = jobRepository;
    this._logger = applicationLogger.getInstance();
    this._metrics = applicationMetrics.getInstance();
  }
  /**
   *  Create a Note
   */
  async createNote(jobId: string, noteData: CreateNoteInputDto): Promise<Note> {
    const job = await this._jobRepository.findByJobId(jobId);

    if (job === null) {
      return null;
    }
    const note = await this._noteRepository.create(job, noteData);

    //Creating a cloud watch metric for how many jobs were created
    this._metrics.addMetric("noteCreated", MetricUnits.Count, 1);
    this._metrics.publishStoredMetrics();

    return note;
  }

  /**
   *  Update a Note, checek if noteId and jobId exist
   */
  async updateNote(
    jobId: string,
    noteId: string,
    noteData: UpdateNoteInputDto
  ): Promise<boolean> {
    const job = await this._jobRepository.findByJobId(jobId);
    const note = await this._noteRepository.findByNoteId(noteId);
    console.log(note);
    if (note === null || job === null) {
      return false;
    }
    await this._noteRepository.updateNoteByNoteId(noteId, noteData);

    //Creating a cloud watch metric for how many jobs were created
    this._metrics.addMetric("noteCreated", MetricUnits.Count, 1);
    this._metrics.publishStoredMetrics();

    return true;
  }
}
