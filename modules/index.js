import * as Modules from "./modules.js";

export const getAllCommands = () => {
	return Object.values(Modules).flatMap(m=>([...Object.values(m).map(v=>({...v}))]));
};