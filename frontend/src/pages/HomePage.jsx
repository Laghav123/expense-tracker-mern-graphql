import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import Cards from "../components/Cards";
import TransactionForm from "../components/TransactionForm";

import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/users.mutation";
import { GET_AUTHENTICATED_USER } from "../graphql/queries/users.query";
import { GET_CATEGORY_STATISTICS } from "../graphql/queries/transaction.query";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = ({authUser}) => {
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [
			{
				label: "Rs.",
				data: [],
				backgroundColor: [],
				borderColor: [],
				borderWidth: 1,
				borderRadius: 30,
				spacing: 10,
				cutout: 130,
			},
		],
	});
	const [logout, {loading, client}] = useMutation(LOGOUT, {
		refetchQueries: [GET_AUTHENTICATED_USER]
	});
	const {data, loading:loadingCategoryData} = useQuery(GET_CATEGORY_STATISTICS);
	console.log("categoryStatistics:",data);
	useEffect(() =>{
		if(data?.categoryStatistics){
			const backgroundColor= [];
			const borderColor= [];
			const labels = [];
			const totalAmounts = [];
			data.categoryStatistics.forEach(stats=>{
				if(stats.category === "savings"){
					backgroundColor.push("rgba(75, 192, 192)");
					borderColor.push("rgba(75, 192, 192)");
					labels.push("Savings");
					totalAmounts.push(stats.totalAmount);
				}
				if(stats.category === "expense"){
					backgroundColor.push("rgba(255, 99, 132)");
					borderColor.push("rgba(255, 99, 132)");
					labels.push("Expense");
					totalAmounts.push(stats.totalAmount);
				}
				if(stats.category === "investment"){
					backgroundColor.push("rgba(54, 162, 235)");
					borderColor.push("rgba(54, 162, 235)");
					labels.push("Investment");
					totalAmounts.push(stats.totalAmount);
				}
			});

			setChartData((prevData)=>({
					labels,
					datasets: [{
						...prevData.datasets[0],
						data: totalAmounts,
						backgroundColor,
						borderColor
					}]
				})
			);
		}
	},[data])

	const handleLogout = async () => {
		try {
			await logout();
			client.resetStore();
			toast.success("Logged out successfully");
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		}
	};

	return (
		<>
			<div className='flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center'>
				<div className='flex items-center'>
					<p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text'>
						Spend wisely, track wisely
					</p>
					<img
						src={authUser.profilePicture}
						className='w-11 h-11 rounded-full border cursor-pointer'
						alt='Avatar'
						title={authUser.name}
					/>
					{!loading && <MdLogout className='mx-2 w-5 h-5 cursor-pointer' onClick={handleLogout} />}
					{/* loading spinner */}
					{loading && <div className='w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin'></div>}
				</div>
				<div className='flex flex-wrap w-full justify-center items-center gap-6'>
					{data?.categoryStatistics?.length ?
						<div className='h-[330px] w-[330px] md:h-[360px] md:w-[360px]  '>
							<Doughnut data={chartData} />
						</div> : ``
					}

					<TransactionForm />
				</div>
				<Cards />
			</div>
		</>
	);
};
export default HomePage;