import { EditAction } from './EditAction';

export interface IActionParams {
  startXFloat: number;
  startYFloat: number;
  endXFloat: number;
  endYFloat: number;
  action: EditAction;
}
