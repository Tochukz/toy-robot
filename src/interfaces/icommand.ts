import { Action } from "./common-types";
import { IPosition } from "./iposition";

export interface  ICommand { 
  place?: IPosition,
  action?: Action
}