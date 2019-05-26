using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using WebApplication13.Models;

namespace WebApplication13.Controllers
{
    public class CTDonHangsController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: CTDonHangs
        public ActionResult Index()
        {
            var cTDonHangs = db.CTDonHangs.Include(c => c.DonHang).Include(c => c.SanPham);
            return View(cTDonHangs.ToList());
        }

        // GET: CTDonHangs/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            CTDonHang cTDonHang = db.CTDonHangs.Find(id);
            if (cTDonHang == null)
            {
                return HttpNotFound();
            }
            return View(cTDonHang);
        }

        // GET: CTDonHangs/Create
        public ActionResult Create()
        {
            ViewBag.DonhangId = new SelectList(db.DonHangs, "DonHangId", "HinhThucTT");
            ViewBag.SanPhamId = new SelectList(db.SanPhams, "SanPhamId", "TenSP");
            return View();
        }

        // POST: CTDonHangs/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "CTDonHangId,SoLuong,DonGia,GiamGia,DonhangId,SanPhamId")] CTDonHang cTDonHang)
        {
            if (ModelState.IsValid)
            {
                db.CTDonHangs.Add(cTDonHang);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.DonhangId = new SelectList(db.DonHangs, "DonHangId", "HinhThucTT", cTDonHang.DonhangId);
            ViewBag.SanPhamId = new SelectList(db.SanPhams, "SanPhamId", "TenSP", cTDonHang.SanPhamId);
            return View(cTDonHang);
        }

        // GET: CTDonHangs/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            CTDonHang cTDonHang = db.CTDonHangs.Find(id);
            if (cTDonHang == null)
            {
                return HttpNotFound();
            }
            ViewBag.DonhangId = new SelectList(db.DonHangs, "DonHangId", "HinhThucTT", cTDonHang.DonhangId);
            ViewBag.SanPhamId = new SelectList(db.SanPhams, "SanPhamId", "TenSP", cTDonHang.SanPhamId);
            return View(cTDonHang);
        }

        // POST: CTDonHangs/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "CTDonHangId,SoLuong,DonGia,GiamGia,DonhangId,SanPhamId")] CTDonHang cTDonHang)
        {
            if (ModelState.IsValid)
            {
                db.Entry(cTDonHang).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.DonhangId = new SelectList(db.DonHangs, "DonHangId", "HinhThucTT", cTDonHang.DonhangId);
            ViewBag.SanPhamId = new SelectList(db.SanPhams, "SanPhamId", "TenSP", cTDonHang.SanPhamId);
            return View(cTDonHang);
        }

        // GET: CTDonHangs/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            CTDonHang cTDonHang = db.CTDonHangs.Find(id);
            if (cTDonHang == null)
            {
                return HttpNotFound();
            }
            return View(cTDonHang);
        }

        // POST: CTDonHangs/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            CTDonHang cTDonHang = db.CTDonHangs.Find(id);
            db.CTDonHangs.Remove(cTDonHang);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
