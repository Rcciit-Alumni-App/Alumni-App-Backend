import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from 'src/user/auth/guards';
import { Role, Roles } from 'utils/decorators/role.decorator';
import { CreateEventDto, UpdateEventDto } from './dto';
import { Token } from 'utils/decorators/token.decorator';

@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
    constructor(private readonly eventService: EventsService) { }

    @Get("/get-all")
    async getAllEvents(@Query('skip') skip: number, @Query('limit') limit: number) {
        return this.eventService.getAllEvents(limit, skip);
    }

    @Get("/get")
    async getEvent(@Param("id") id: string) {
        return this.eventService.getEvent(id);
    }

    @Post("/create")
    @Roles(Role.ADMIN)
    async createEvent(@Token() token: string, @Body() createEventDto: CreateEventDto) {
        return await this.eventService.createEvent(token, createEventDto);
    }

    @Put("/update")
    @Roles(Role.ADMIN)
    async updateEvent(@Token() token: string, @Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
        return this.eventService.updateEvent(token, id, updateEventDto);
    }

    @Delete("/delete")
    @Roles(Role.ADMIN)
    async deleteEvent(@Token() token: string, @Param('id') id: string) {
        return this.eventService.deleteEvent(token, id);
    }

    @Post('/interest')
    async showInterest(@Token() token: string, @Body() eventId: string) {
        return this.eventService.showInterest(token, eventId);
    }

    async sendNotification() {
        //TODO: to be implemented
        return this.eventService.sendNotification();
    }
}
