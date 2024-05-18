export default function AccountCard(props: any) {

    return (<>

            
<div className="flex justify-center items-center h-full p-8">
  <div className="bg-white p-8 rounded-lg shadow-lg">
    <div className="flex justify-center">
      <div className="w-24 h-24 rounded-full overflow-hidden">
        {/* <img className="w-full h-full object-cover" src={`http://localhost:3001/user/profile-picture/${userData.userId}`} alt="User Profile" /> */}
      </div>
    </div>
    <div className="mt-4">


    <div className="flex-none gap-2 relative">

    <button tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-20 h-10 rounded-full overflow-hidden">
          <img className="w-full h-full object-cover" src={`http://localhost:3001/user/getimage/${props.data.filename}`} alt="User Profile" />
        </div>
      </button>

      </div>
      
      <h3 className="text-2xl font-bold">Balance: {props.data.balance}</h3>

      <h2 className="text-2xl font-bold">Account Number: {props.data.accountNumber}</h2>
      <h3 className="text-2xl font-bold">Account type: {props.data.accountType}</h3>
      <p className="mt-2"><span className="font-semibold">Nominee Name:</span> {props.data.name}</p>
      <p><span className="font-semibold">Nominee Gender:</span> {props.data.gender}</p>
      <p><span className="font-semibold">Nominee Address:</span> {props.data.address}</p>
      <p><span className="font-semibold">Nominee Date of birth :</span> {props.data.dob}</p>
      <p><span className="font-semibold">Nominee Phone:</span> {props.data.phone}</p>
      <p><span className="font-semibold">Nominee NID:</span> {props.data.nid}</p>
    </div>
  </div>
</div>


    </>);

}