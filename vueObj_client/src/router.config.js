import User from "./components/user.vue";
import Index from "./components/index.vue";
import Cate from "./components/cate.vue";
import Log from "./components/log.vue";
import Upload from "./components/upload.vue";

const routers=[
	{path:"/",component:Index},
	{path:"/user",component:User},
	{path:"/cate",component:Cate},
	{path:"/log",component:Log},
	{path:"/upload",component:Upload},
];

export default routers;