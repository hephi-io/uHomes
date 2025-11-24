import { NextFunction, Request, Response } from 'express';
import { BookingService } from '../service/booking.service';
import { ResponseHelper } from '../utils/response';

export class BookingController {
  private bookingService = new BookingService();

  createBooking = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { id: string; types: string };
    try {
      const booking = await this.bookingService.createBooking(req.body, user);
      return ResponseHelper.created(res, booking);
    } catch (err) {
      next(err);
    }
  };

  getBooking = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { id: string; types: string } | undefined;
    try {
      const booking = await this.bookingService.getBookingById(
        req.params.id,
        user ? { id: user.id, types: user.types } : undefined
      );
      return ResponseHelper.success(res, booking);
    } catch (err) {
      next(err);
    }
  }


  getAgentBookings = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { id: string; types: string } | undefined;
    try {
      const bookings = await this.bookingService.getBookingsByAgent(
        req.params.agentId,
        user ? { id: user.id, types: user.types } : undefined
      );
      return ResponseHelper.success(res, bookings);
    } catch (err) {
      next(err);
    }
  }



  getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { id: string; types: string }
    try {
      const bookings = await this.bookingService.getAllBookings(user)
      return ResponseHelper.success(res, bookings)
    } catch (err) {
      next(err)
    }
  };

  updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { id: string; types: string } | undefined
    try {
      const updatedBooking = await this.bookingService.updateBookingStatus(
        req.params.id,
        req.body.status,
        user ? { id: user.id, types: user.types } : undefined
      )
      return ResponseHelper.success(res, { message: 'Booking status updated', updatedBooking })
    } catch (err) {
      next(err)
    }
  }


  deleteBooking = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { id: string; types: string };
    try {
      const deletedBooking = await this.bookingService.deleteBooking(req.params.id, user);
      return ResponseHelper.success(res, { message: 'Booking deleted', deletedBooking });
    } catch (err) {
      next(err);
    }
  };
}
