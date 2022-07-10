
// Script for calling Rest APIs from localserver created by index.js

document.addEventListener("DOMContentLoaded", function () {

	document.getElementById("readContract").addEventListener("click", async function () {
		readStatus139();
	});

	document.getElementById("InsertContract").addEventListener("click", async function () {
		initContract139();
	});

	document.getElementById("buyerApprove").addEventListener("click", async function () {
		approveContract139('buyer');
	});

	document.getElementById("buyerReject").addEventListener("click", async function () {
		rejectContract139('buyer');
	});
	
	document.getElementById("sellerApprove").addEventListener("click", async function () {
		approveContract139('seller');
	});

	document.getElementById("sellerReject").addEventListener("click", async function () {
		rejectContract139('seller');
	});
	
	document.getElementById("deleteContract").addEventListener("click", async function () {
		deleteContract139();
	});

});

async function readStatus139() {
	const contractId = document.getElementById('id').value;
	await fetch(`http://localhost:8952/read?id=${contractId}`)
	.then(function (response) {
		return response.json();
	})
	.then(function(data) {
		console.log("Contract Status reading successfully finished: " + data);
		// writing the data to front
		const html = `
        <li><b> Contract ID:</b> ${data.id}</li>
        <li><b>Contract Status:</b> ${data.assetStatus}</li>
		<li><b>Contract Value:</b> ${data.value}</li>
		<li><b>Hash:</b> ${data.valueHash}</li>
		`; 
		// <li><b>Seller Address:</b> ${data.sellerAddress}</li>
		// <li><b>Buyer Address:</b> ${data.buyerAddress}</li>
		document.getElementById("contractStatus").innerHTML = html;
	}).catch (function (err) {
		console.error(err)
	});
}

async function initContract139() {
	const contractId = document.getElementById('id').value;
	console.log(contractId);
	const value = document.getElementById('value').value;
	console.log(value);
	const contractExists = await fetch(`http://localhost:8952/exist?id=${contractId}`)
	.then(function (response) {
		console.log(response);
		return response.json();
	})
	
	console.log(contractExists);
	
	
	// const existValue = false; //existValueJson.value;
	if (!contractExists) {
		await fetch(`http://localhost:8952/create?id=${contractId}&value=${value}`)
		.then(() => {
		console.log("Successfully Initialized");
		})
		.catch (err => {
			console.log("contract initialization error:", err);
		});
	} else {
		if (confirm("Contract exists. Are you going to update this contract?")) {
			await fetch(`http://localhost:8952/update?id=${contractId}&value=${value}`)
			.then(() => {
			console.log("Successfully Updated");
			})
			.catch(err => {
				console.log("Error in updating", err);
			})			
		} else {
			console.log("Nothing happened. Please try anther contract ID.");
		}
	}
	readStatus139();
	
}

async function approveContract139(signerName) {
	const contractId = document.getElementById('id').value;
	fetch(`http://localhost:8952/approve?id=${contractId}&value=${signerName}`)
	.then(() => {
		console.log("Successfully approved by "+signerName);
		readStatus139();
	});
}

async function rejectContract139(signerName) {
	const contractId = document.getElementById('id').value;
	fetch(`http://localhost:8952/reject?id=${contractId}&value=${signerName}`)
	.then(() => {
		console.log("Successfully rejected by "+signerName);
		readStatus139();
	});
}

async function deleteContract139(signerName) {
	const contractId = document.getElementById('id').value;
	fetch(`http://localhost:8952/delete?id=${contractId}`)
	.then(() => {
		console.log("Contract "+contractId+" Successfully deleted");
		readStatus139();
	});
}