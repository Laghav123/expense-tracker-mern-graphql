import { useMutation, useQuery } from "@apollo/client";
import Card from "./Card";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query.js";

const Cards = () => {
	const {data, loading, error} = useQuery(GET_TRANSACTIONS);

	if(error) return <p>Error: {error.message}</p>;
	if(loading) return <p>Loading...</p>;
	
	console.log("transactions: ",data);
	// TODO: ADD RELATIONSHIPS
	return (
		<div className='w-full px-10 min-h-[40vh]'>
			<p className='text-5xl font-bold text-center my-10'>Expense History</p>
			<div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20'>
				{!loading && data.transactions.map(transaction => <Card key={transaction._id} transaction={transaction} />)}
			</div>
			<div>{!loading && data.transactions.length==0 && <p>No transaction history found</p>}</div>
		</div>
	);
};
export default Cards;