//export { default as EditDetailsView } from "./EditDetailsView";
import * as editModelActions from "./actions";
export { editModelActions };

export { default as EditTagView, reducer as editTagReducer, epic as editTagEpic, editTagActions } from "./EditTagView";
export { default as DeployContract } from "./DeployContract";
export { default as EditDetailsView } from "./EditDetailsView";
export { reducer as EditModelReducer, epic as editModelEpics } from "./reducer";
export {default as EditUserView} from "./EditUserView";