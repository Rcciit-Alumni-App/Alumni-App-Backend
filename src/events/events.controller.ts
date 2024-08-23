import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from 'src/user/auth/guards';
import { Role, Roles } from 'utils/decorators/role.decorator';
import { CreateEventDto, UpdateEventDto } from './dto';
import { Token } from 'utils/decorators/token.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
    constructor(private readonly eventService: EventsService) { }

    @ApiOperation({ summary: 'Retrieve all events' })
    @ApiResponse({ status: 200, description: 'Events retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Events not found.' })
    @Get("/get-all")
    async getAllEvents(@Query('page') page: string, @Query('limit') limit: string) {
        return this.eventService.getAllEvents(page, limit);
    }

    @ApiOperation({ summary: 'Retrieve a single event by ID' })
    @ApiResponse({ status: 200, description: 'Event retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Event not found.' })
    @Get("/get/:id")
    async getEvent(@Param("id") id: string) {
        return this.eventService.getEvent(id);
    }

    @ApiOperation({ summary: 'Create a new event' })
    @ApiResponse({ status: 201, description: 'Event created successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @Post("/create")
    @Roles(Role.ADMIN)
    async createEvent(@Token() token: string, @Body() createEventDto: CreateEventDto) {
        return await this.eventService.createEvent(token, createEventDto);
    }

    @ApiOperation({ summary: 'Update an existing event' })
    @ApiResponse({ status: 200, description: 'Event updated successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Event not found.' })
    @Put("/update/:id")
    @Roles(Role.ADMIN)
    async updateEvent(@Token() token: string, @Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
        return this.eventService.updateEvent(token, id, updateEventDto);
    }

    @ApiOperation({ summary: 'Delete an event' })
    @ApiResponse({ status: 200, description: 'Event deleted successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Event not found.' })
    @Delete("/delete/:id")
    @Roles(Role.ADMIN)
    async deleteEvent(@Token() token: string, @Param('id') id: string) {
        return this.eventService.deleteEvent(token, id);
    }

    @ApiOperation({ summary: 'Show interest in an event' })
    @ApiResponse({ status: 200, description: 'Interest shown successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Event not found.' })
    @Post('/interest')
    async showInterest(@Token() token: string, @Body() { eventId }: { eventId: string }) {
        return this.eventService.showInterest(token, eventId);
    }

    async sendNotification() {
        //TODO: to be implemented
        return this.eventService.sendNotification();
    }
}
