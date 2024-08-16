import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { decodeToken } from 'utils/auth/decodeToken';
import { RedisService } from 'src/redis/redis.service';
import { Events } from '@prisma/client';

@Injectable()
export class EventsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
        private readonly redis: RedisService
    ) { }

    async getAllEvents(take: number, skip: number) {
        const events = await this.prisma.events.findMany({
            skip: skip,
            take: take,
        });
        events.map((event) => {
            this.redis.setCache(event.id, event);
        });
        return events;
    }

    async getEvent(id: string) {

        let event: Events;
        event = await this.redis.getValue(`event:${event.id}`);
        if (event)
            return event;

        event = await this.prisma.events.findFirst({
            where: {
                id: id
            }
        });

        this.redis.setCache(`event:${event.id}`, event);

        return event;
    }

    async createEvent(token: string, createEventDto: CreateEventDto) {
        const userId = decodeToken(token, this.jwt, this.config);
        const user = await this.redis.getValue(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const events = this.prisma.events.create({
            data: {
                ...createEventDto,
                userId: userId
            }
        });

        return events;
    }

    async updateEvent(token: string, eventId: string, updateEventDto: UpdateEventDto) {
        const userId = decodeToken(token, this.jwt, this.config);
        const user = await this.redis.getValue(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const event = await this.prisma.events.findFirst({
            where: {
                id: eventId,
                userId: userId
            }
        });

        if (!event)
            throw new UnauthorizedException("Event not found");

        const updatedEvent = await this.prisma.events.update({
            where: {
                id: event.id
            },
            data: {
                ...updateEventDto
            }
        });

        return updatedEvent;
    }

    async deleteEvent(token: string, eventId: string) {
        const userId = decodeToken(token, this.jwt, this.config);
        const user = await this.redis.getValue(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const event = await this.prisma.events.findFirst({
            where: {
                id: eventId,
                userId: userId
            }
        });

        if (!event)
            throw new UnauthorizedException("Event not found");

        await this.prisma.events.delete({
            where: {
                id: event.id
            }
        });
    }

    async showInterest(token: string, eventId: string) {
        const userId = decodeToken(token, this.jwt, this.config);
        const user = await this.redis.getValue(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const event = await this.prisma.events.findFirst({
            where: {
                id: eventId,
            }
        });

        if (event.userId === userId)
            throw new Error("You can't show interest in your event");

        const existsInterest = await this.prisma.eventInterests.findFirst({
            where: {
                userId: userId,
                eventId: eventId
            }
        });

        if (existsInterest) {
            await this.prisma.eventInterests.delete({
                where: {
                    userId: userId,
                    eventId: eventId
                }
            })
        }
        else {
            await this.prisma.eventInterests.create({
                data: {
                    userId: userId,
                    eventId: eventId,
                    expiresAt: event.expires_at
                },

            });
        }
    }

    async sendNotification() {
        //TODO: To be implemented
    }
}