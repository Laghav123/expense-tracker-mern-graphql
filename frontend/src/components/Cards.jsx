import { useMutation, useQuery } from "@apollo/client";
import Card from "./Card";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query.js";
import { GET_AUTHENTICATED_USER, GET_USER_AND_TRANSACTIONS } from "../graphql/queries/users.query.js";

const Cards = () => {
	const {data, loading, error} = useQuery(GET_TRANSACTIONS);
	const {data:authUser} = useQuery(GET_AUTHENTICATED_USER);
	const userId = authUser?.authUser?._id;

	// const {data:userAndTransactions} = useQuery(GET_USER_AND_TRANSACTIONS, {variables:{ userId }});
	// console.log("userAndTransactions",userAndTransactions);

	if(error) return <p>Error: {error.message}</p>;
	if(loading) return <p>Loading...</p>;
	
	console.log("transactions: ",data);
	// TODO: ADD RELATIONSHIPS
	return (
		<div className='w-full px-10 min-h-[40vh]'>
			<p className='text-5xl font-bold text-center my-10'>Expense History</p>
			{(!loading && data.transactions.length) ?
				(<div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20'>
					{data.transactions.map(transaction => <Card key={transaction._id} transaction={transaction} authUser={authUser.authUser}/>)}
				</div>) : ``
			}
			<p className='font-bold text-center'>{!loading && data.transactions.length==0 && <p>No transaction history found</p>}</p>

		</div>
	);
};
export default Cards;