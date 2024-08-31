import "./list.css"
import Clist from "./clist/clist"
import User from "./user/user"
const List=()=>{
    return (
        <div className="list">
             <User />
            <Clist />
           
        </div>
    )
}
export default List;