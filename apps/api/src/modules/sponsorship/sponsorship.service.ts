import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { SponsorshipRequestStatus, SponsorshipStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateSponsorshipDto } from "./dto/create-sponsorship.dto";
import { CreateSponsorshipRequestDto } from "./dto/create-sponsorship-request.dto";

@Injectable()
export class SponsorshipService {
  constructor(private prisma: PrismaService) {}

  createPledge(sponsorId: string, dto: CreateSponsorshipDto) {
    return this.prisma.sponsorship.create({
      data: {
        sponsorId,
        companyName: dto.companyName,
        tier: dto.tier ?? "standard",
        amount: dto.amount,
        status: SponsorshipStatus.PENDING,
      },
    });
  }

  myPledges(sponsorId: string) {
    return this.prisma.sponsorship.findMany({
      where: { sponsorId },
      include: { matchedRequest: true },
      orderBy: { createdAt: "desc" },
    });
  }

  listPledges(status?: string) {
    return this.prisma.sponsorship.findMany({
      where: { status: (status as any) || undefined },
      include: {
        sponsor: { select: { id: true, name: true, email: true } },
        matchedRequest: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async approvePledge(id: string) {
    return this.prisma.sponsorship.update({
      where: { id },
      data: { status: SponsorshipStatus.APPROVED },
    });
  }

  rejectPledge(id: string) {
    return this.prisma.sponsorship.update({
      where: { id },
      data: { status: SponsorshipStatus.REJECTED },
    });
  }

  createRequest(requesterId: string, dto: CreateSponsorshipRequestDto) {
    return this.prisma.sponsorshipRequest.create({
      data: {
        requesterId,
        title: dto.title,
        description: dto.description,
        amountRequested: dto.amountRequested,
        status: SponsorshipRequestStatus.PENDING,
      },
    });
  }

  myRequests(requesterId: string) {
    return this.prisma.sponsorshipRequest.findMany({
      where: { requesterId },
      include: { sponsorship: true },
      orderBy: { createdAt: "desc" },
    });
  }

  listRequests(status?: string) {
    return this.prisma.sponsorshipRequest.findMany({
      where: { status: (status as any) || undefined },
      include: {
        requester: { select: { id: true, name: true, email: true } },
        sponsorship: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  rejectRequest(id: string) {
    return this.prisma.sponsorshipRequest.update({
      where: { id },
      data: { status: SponsorshipRequestStatus.REJECTED },
    });
  }

  async match(sponsorshipId: string, requestId: string) {
    const [sponsorship, request] = await Promise.all([
      this.prisma.sponsorship.findUnique({ where: { id: sponsorshipId } }),
      this.prisma.sponsorshipRequest.findUnique({ where: { id: requestId } }),
    ]);
    if (!sponsorship) throw new NotFoundException("Sponsorship pledge not found");
    if (!request) throw new NotFoundException("Sponsorship request not found");
    if (sponsorship.matchedRequestId) {
      throw new BadRequestException("This pledge is already matched to a request");
    }

    const [updatedSponsorship] = await this.prisma.$transaction([
      this.prisma.sponsorship.update({
        where: { id: sponsorshipId },
        data: { matchedRequestId: requestId, status: SponsorshipStatus.APPROVED },
      }),
      this.prisma.sponsorshipRequest.update({
        where: { id: requestId },
        data: { status: SponsorshipRequestStatus.MATCHED },
      }),
    ]);
    return updatedSponsorship;
  }
}
