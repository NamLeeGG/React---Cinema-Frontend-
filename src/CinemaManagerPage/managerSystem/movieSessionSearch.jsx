import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";

class MovieSessionSearchPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchQuery: "",
			searchResults: [],
			selectedUser: null,
			isPopupUpOpen: false,
			isPopupDelOpen: false,
			contextMenuCoordinates: { x: 0, y: 0 },
			showContextMenu: false,
		};
	}

	handleInputChange = (event) => {
		this.setState({ searchQuery: event.target.value });
	};

	handleSearch = () => {
		const { searchQuery } = this.state;
		if (searchQuery === "") {
			Swal.fire("Error", "Please enter a search query", "error");
			return;
		}

		const token = localStorage.getItem("token");

		const requestBody = {
			keyword: searchQuery,
		};

		axios
			.post(
				"https://csit-314-cinema-booking-system.vercel.app/searchMovieSession/",
				requestBody,
				{
					headers: {
						Authorization: `Token ${token}`,
					},
				}
			)
			.then((response) => {
				const searchResults = response.data;
				this.setState({ searchResults });
			})
			.catch((error) => {
				console.error("There was an error!", error);
			});
	};

	handleContextMenu = (event, result) => {
		event.preventDefault();
		this.setState({
			contextMenuCoordinates: { x: event.clientX, y: event.clientY },
			selectedUser: result,
			showContextMenu: true,
		});
	};

	hideContextMenu = () => {
		this.setState({
			showContextMenu: false,
		});
	};
	componentDidMount() {
		document.addEventListener("click", this.hideContextMenu);
	}

	componentWillUnmount() {
		document.removeEventListener("click", this.hideContextMenu);
	}

	render() {
		const { searchQuery, searchResults, contextMenuCoordinates } = this.state;

		return (
			<div className="useradminSearchAcc--container">
				<div className="useradminSearchAcc--inputContainer">
					<input
						className="useradminSearchAcc--input"
						type="text"
						value={searchQuery}
						onChange={this.handleInputChange}
						placeholder="Enter search query"
					/>
					<button
						className="useradminSearchAcc--button"
						onClick={this.handleSearch}
					>
						Search
					</button>
				</div>
				<div className="useradminSearchAcc--results">
					{searchResults.length > 0 ? (
						<div className="useradminSearchAcc--tableContainer">
							<table className="useradminSearchAcc--table">
								<tbody>
									{searchResults.map((result) => (
										<tr
											key={result.id}
											onContextMenu={(e) => {
												this.handleContextMenu(e, result);
											}}
										>
											<td>{result.movie_title}</td>
											<td>{result.session_date}</td>
											<td>{result.cinema_room}</td>
											<td>{result.session_time}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<p>No results found.</p>
					)}
				</div>
			</div>
		);
	}
}

export default MovieSessionSearchPage;
