import { StatusCodes } from "http-status-codes";

export class CustomError extends Error{
    constructor(StatusCode,message){
        super(message);
        this.StatusCode = StatusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}