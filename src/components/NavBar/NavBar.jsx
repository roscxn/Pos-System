import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
<div className="navbar bg-base-100">
  <div className="flex-1">
    <div className="btn btn-ghost normal-case text-xl"><Link to="/">ROS POS</Link></div>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-1">
      <li><Link to="/product/add">Add New</Link></li>
      <li><Link to="/cart/history">Past Transactions</Link></li>
    </ul>
  </div>
</div>
    )
}

export default NavBar