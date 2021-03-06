//export { default as EditDetailsView } from "./EditDetailsView";
import * as editModelActions from "./actions";
export { editModelActions };

export { default as EditTagView, epic as editTagEpic } from "./EditTagView";
export { default as DeployContract } from "./DeployContract";
export { default as EditDetailsView } from "./EditDetailsView";
export { reducer as EditModelReducer, epic as editModelEpics } from "./reducer";
export {EditUserView, EditLinkView} from "./EditUserView";
export { ProvRecordsView } from "./ProvRecordsView";