const { expect } = require("chai");

describe("Vault 2", () => {
  beforeEach(async () => {
    Vault2 = await ethers.getContractFactory("Vault2");
    [owner] = await ethers.getSigners();

    vault2 = await Vault2.deploy();

    await vault2.deployed();
  });

  it("should deposit ETH and receive back equal amounts of VAULT tokens", async () => {
    [owner] = await ethers.getSigners();
    const initialBalance = await owner.getBalance();

    await vault2.connect(owner).mint({ value: ethers.utils.parseEther("1") });
    expect(await vault2.balanceOf(owner.address)).to.equal(
      ethers.utils.parseEther("1")
    );
    expect(
      Math.ceil(ethers.utils.formatEther(await owner.getBalance()))
    ).to.equal(Math.ceil(ethers.utils.formatEther(initialBalance) - 1));
  });

  it("should ask for the ETH back and have their VAULT tokens burned", async () => {
    [owner] = await ethers.getSigners();
    const initialBalance = await owner.getBalance();

    await vault2.connect(owner).mint({ value: ethers.utils.parseEther("1") });
    await vault2.connect(owner).burn(ethers.utils.parseEther("0.5"));
    // account should have half it's tokens left in the vault
    expect(await vault2.balanceOf(owner.address)).to.equal(
      ethers.utils.parseEther("0.5")
    );
    await vault2.connect(owner).burn(ethers.utils.parseEther("0.5"));
    // account should have no tokens left in the vault
    expect(await vault2.balanceOf(owner.address)).to.equal(
      ethers.utils.parseEther("0")
    );
    // ETH amount should be back to original - gas
    expect(
      Math.ceil(ethers.utils.formatEther(await owner.getBalance()))
    ).to.equal(Math.ceil(ethers.utils.formatEther(initialBalance)));
  });
  it("should get reverted if tries to withdraw more than available", async () => {
    [owner] = await ethers.getSigners();

    await expect(
      vault2.connect(owner).burn(ethers.utils.parseEther("0.5"))
    ).to.be.revertedWith("Not enough tokens");
  });
});