export default function SideBar(){

    return (
        <>


<div className="navbar bg-base-100">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex="0" role="button" class="btn btn-ghost btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
      </div>
      <ul tabIndex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
      <ul tabIndex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <li><a>TRANSACTION</a></li>
        <li>
          <a>Transfer</a>
          <ul className="p-2">
            <li><a href="/withdraw">Withdraw Money</a></li>
            <li><a href="/deposit"> Deposit Money</a></li>
          </ul>
        </li>
        <li><a href="/transection"> Transaction Details</a></li>
      </ul>
      </ul>
    </div>
  </div>
  <div className="mt-4"></div> 

 
</div>


        </>

    );
}