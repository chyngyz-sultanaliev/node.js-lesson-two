import { Request, Response } from "express";
declare const _default: {
    getData: (req: Request, res: Response) => void;
    addData: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
    updateData: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
    deleteData: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
    searchData: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
    downloadExcel: (req: Request, res: Response) => void;
};
export default _default;
//# sourceMappingURL=todo.controllers.d.ts.map