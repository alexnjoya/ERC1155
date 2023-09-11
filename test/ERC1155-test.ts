import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import { ethers } from "hardhat";

describe('MyMultiToken', () => {
  let myMultiToken: Contract;
  let owner: Signer;
  let user: Signer;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();

    const MyMultiToken = await ethers.getContractFactory('MyMultiToken');
    myMultiToken = await MyMultiToken.connect(owner).deploy();
  });

  it('should mint tokens and check balances', async () => {
    const tokenId = 1;
    const mintAmount = 100;

    await myMultiToken.connect(owner).mint(tokenId, mintAmount, '0x');
    const balanceOwner = await myMultiToken.balanceOf(await owner.getAddress(), tokenId);
    expect(balanceOwner).to.equal(mintAmount);

    await myMultiToken.connect(user).mint(tokenId, mintAmount, '0x');
    const balanceUser = await myMultiToken.balanceOf(await user.getAddress(), tokenId);
    expect(balanceUser).to.equal(mintAmount);
  });

  it('should burn tokens and check balances', async () => {
    const tokenId = 1;
    const mintAmount = 100;
    const burnAmount = 50;

    await myMultiToken.connect(owner).mint(tokenId, mintAmount, '0x');
    await myMultiToken.connect(owner).burn(tokenId, burnAmount);
    const balanceOwner = await myMultiToken.balanceOf(await owner.getAddress(), tokenId);
    expect(balanceOwner).to.equal(mintAmount - burnAmount);

    await myMultiToken.connect(user).mint(tokenId, mintAmount, '0x');
    await myMultiToken.connect(user).burn(tokenId, burnAmount);
    const balanceUser = await myMultiToken.balanceOf(await user.getAddress(), tokenId);
    expect(balanceUser).to.equal(mintAmount - burnAmount);
  });
});
