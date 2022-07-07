const { expect } = require("chai");
describe("Vault 1", () => {
	let vault1, token1, token2;

	beforeEach(async () => {
		Vault1 = await ethers.getContractFactory("Vault1");
		const Token1 = await ethers.getContractFactory("Token1");
		const Token2 = await ethers.getContractFactory("Token2");

		[owner, addr1] = await ethers.getSigners();

		vault1 = await Vault1.deploy();
		token1 = await Token1.deploy();
		token2 = await Token2.deploy();

		await vault1.deployed();
		await token1.deployed();
		await token2.deployed();
	});

	it("should deposit ERC20 into vault", async () => {
		const initialToken1Amount = await token1.balanceOf(owner.address);
		const initialToken2Amount = await token2.balanceOf(owner.address);

		expect(await vault1.tokenBalanceOf(owner.address, token1.address)).to.equal(0);

		// deposits token1 into vault
		await token1.connect(owner).approve(vault1.address, 1000);// first approve
		await vault1.connect(owner).deposit(100, token1.address);
		expect(await vault1.tokenBalanceOf(owner.address, token1.address)).to.equal(100);
		expect(await token1.balanceOf(owner.address)).to.equal(initialToken1Amount - 100);

		await token2.connect(owner).approve(vault1.address, 1000);
		// deposits token2 into vault
		await vault1.connect(owner).deposit(200, token2.address);
		expect(await vault1.tokenBalanceOf(owner.address, token2.address)).to.equal(200);
		expect(await token2.balanceOf(owner.address)).to.equal(initialToken2Amount - 200);
	});

	it("should withdraw ERC20 into vault", async () => {
		// deposits token1 into vault
		await token1.connect(owner).approve(vault1.address, 1000);// owner approves vault1 for 1000
		await vault1.connect(owner).deposit(100, token1.address);// vault1 deposits 100
		const token1AmountOfOwner = await token1.balanceOf(owner.address);// 
		expect(await token1.totalSupply()).to.equal(10000);
		expect(token1AmountOfOwner).to.equal(await token1.totalSupply() - 100);
		await vault1.connect(owner).withdraw(50, token1.address);

		expect(await vault1.tokenBalanceOf(owner.address, token1.address)).to.equal(50);
		expect(await token1.balanceOf(owner.address)).to.equal(9950);

		// deposits token2 into vault
		await token2.connect(owner).approve(vault1.address, 1000);// approve allowance of owner to vault (on ERC20)
		await vault1.connect(owner).deposit(1000, token2.address);
		const token2AmountOfOwner = await token2.balanceOf(owner.address);
		expect(token2AmountOfOwner).to.equal(9000);
		await vault1.connect(owner).withdraw(750, token2.address);
		expect(await vault1.tokenBalanceOf(owner.address, token2.address)).to.equal(250);
		expect(await token2.balanceOf(owner.address)).to.equal(Number(token2AmountOfOwner) + 750);//9750
	});

	it("withdrawing the exact amount should be possible", async () => {
		// deposits token1 into vault
		await token1.connect(owner).approve(vault1.address, 1000);
		await vault1.connect(owner).deposit(100, token1.address);
		expect(await vault1.tokenBalanceOf(owner.address, token1.address)).to.equal(100);
		await vault1.connect(owner).withdraw(100, token1.address);
		expect(await vault1.tokenBalanceOf(owner.address, token1.address)).to.equal(0);
		// should be reverted with underflow
		// await vault1.connect(owner).withdraw(500, token1.address)
		await expect(vault1.connect(owner).withdraw(500, token1.address)).to.be.revertedWith(
			"Account has not enough tokens in the vault"
		);
	});

	it("withdrawing more than it's available, should revert", async () => {
		// deposits token1 into vault
		await token1.connect(owner).approve(vault1.address, 1000);
		await vault1.connect(owner).deposit(100, token1.address);
		// should be reverted with underflow
		await expect(vault1.connect(owner).withdraw(500, token1.address)).to.be.reverted;
	});

	it("should revert when tries to deposit 0", async function () {
		await expect(vault1.connect(owner).deposit(0, token1.address)).to.be.revertedWith("Amount can not be zero");
	});

	it("should revert when tries to withdraw 0", async function () {
		await expect(vault1.connect(owner).withdraw(0, token1.address)).to.be.revertedWith("Amount can not be zero");
	});
});