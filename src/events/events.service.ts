import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { decodeToken } from 'utils/auth/decodeToken';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class EventsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
        private readonly redis: RedisService
    ) { }

    async getAllEvents(page: string, limit: string) {
        let skip = 0;
        let take: number | undefined = undefined;
        if (page && limit) {
            skip = (parseInt(page) - 1) * parseInt(limit);
            take = parseInt(limit);
        } else if (page && !limit) {
            skip = (parseInt(page) - 1) * 10; // Default limit if only page is provided, you can adjust the default value
        }
        const events = await this.prisma.events.findMany({
            skip: skip,
            take: take,
            select: {
                id: true,
                event_name: true,
                banner_image: true,
                schedule: true,
                description: true,
            }
        });
        events.map((event) => {
            this.redis.setCache(event.id, event);
        });
        return events;
    }

    async getAllEventsByUserId(token: string, page: string, limit: string) {
        let skip = 0;
        let take: number | undefined = undefined;
        if (page && limit) {
            skip = (parseInt(page) - 1) * parseInt(limit);
            take = parseInt(limit);
        } else if (page && !limit) {
            skip = (parseInt(page) - 1) * 10; // Default limit if only page is provided, you can adjust the default value
        }
        const userId = decodeToken(token, this.jwt, this.config);
        const user = await this.redis.getValue(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const events = await this.prisma.events.findMany({
            where: {
                userId: userId,
            },
            skip: skip,
            take: take,
            select: {
                id: true,
                event_name: true,
                banner_image: true,
                schedule: true,
                description: true,
            }
        });
        events.map((event) => {
            this.redis.setCache(event.id, event);
        });
        return events;
    }

    async getEvent(id: string) {

        let event: any;
        event = await this.redis.getValue(`event:${id}`);
        if (event)
            return event;

        event = await this.prisma.events.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                venue: true,
                schedule: true,
                banner_image: true,
                images: true,
                announcements: true,
                event_name: true,
                rules: true,
                description: true,
                attractions: true,
                eventInterests: true,
                created_at: true,
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

        console.log('Here 1');
        const event = await this.prisma.events.findFirst({
            where: {
                id: eventId,
            }
        });
        console.log('Here 2');

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
                    id: existsInterest.id,
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
