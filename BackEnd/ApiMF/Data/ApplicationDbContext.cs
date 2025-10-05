using System;
using System.Collections.Generic;
using ApiMF.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApiMF.Data;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<CompanyCollaboration> CompanyCollaborations { get; set; }

    public virtual DbSet<CompanyContact> CompanyContacts { get; set; }

    public virtual DbSet<ContactType> ContactTypes { get; set; }

    public virtual DbSet<Event> Events { get; set; }

    public virtual DbSet<EventTeamMember> EventTeamMembers { get; set; }

    public virtual DbSet<EventType> EventTypes { get; set; }

    public virtual DbSet<OutreachStatus> OutreachStatuses { get; set; }

    public virtual DbSet<OutreachTask> OutreachTasks { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=192.168.0.55;Port=5432;Database=aplicatiemf;Username=mihai;Password=parola_foarte_forta;SSL Mode=Require;Trust Server Certificate=true");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Company>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("companies_pkey");

            entity.ToTable("companies", "mf");

            entity.HasIndex(e => e.Name, "uq_companies_name_ci").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CanContactAd)
                .HasDefaultValue(false)
                .HasColumnName("can_contact_ad");
            entity.Property(e => e.CanContactBb)
                .HasDefaultValue(false)
                .HasColumnName("can_contact_bb");
            entity.Property(e => e.CanContactCa)
                .HasDefaultValue(false)
                .HasColumnName("can_contact_ca");
            entity.Property(e => e.CanContactMi)
                .HasDefaultValue(false)
                .HasColumnName("can_contact_mi");
            entity.Property(e => e.CanContactSh)
                .HasDefaultValue(false)
                .HasColumnName("can_contact_sh");
            entity.Property(e => e.CanContactZa)
                .HasDefaultValue(false)
                .HasColumnName("can_contact_za");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("updated_at");
            entity.Property(e => e.Website).HasColumnName("website");
        });

        modelBuilder.Entity<CompanyCollaboration>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("company_collaborations_pkey");

            entity.ToTable("company_collaborations", "mf");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Amount)
                .HasPrecision(12, 2)
                .HasColumnName("amount");
            entity.Property(e => e.CompanyId).HasColumnName("company_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.EventTypeId).HasColumnName("event_type_id");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.Outcome).HasColumnName("outcome");
            entity.Property(e => e.Year).HasColumnName("year");

            entity.HasOne(d => d.Company).WithMany(p => p.CompanyCollaborations)
                .HasForeignKey(d => d.CompanyId)
                .HasConstraintName("company_collaborations_company_id_fkey");

            entity.HasOne(d => d.EventType).WithMany(p => p.CompanyCollaborations)
                .HasForeignKey(d => d.EventTypeId)
                .HasConstraintName("company_collaborations_event_type_id_fkey");
        });

        modelBuilder.Entity<CompanyContact>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("company_contacts_pkey");

            entity.ToTable("company_contacts", "mf");

            entity.HasIndex(e => new { e.CompanyId, e.ContactTypeId, e.Value }, "uq_company_contact").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CompanyId).HasColumnName("company_id");
            entity.Property(e => e.ContactTypeId).HasColumnName("contact_type_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.ExtraInfo)
                .HasDefaultValueSql("'{}'::jsonb")
                .HasColumnType("jsonb")
                .HasColumnName("extra_info");
            entity.Property(e => e.IsPrimary)
                .HasDefaultValue(false)
                .HasColumnName("is_primary");
            entity.Property(e => e.PersonName).HasColumnName("person_name");
            entity.Property(e => e.Position).HasColumnName("position");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("updated_at");
            entity.Property(e => e.Value).HasColumnName("value");

            entity.HasOne(d => d.Company).WithMany(p => p.CompanyContacts)
                .HasForeignKey(d => d.CompanyId)
                .HasConstraintName("company_contacts_company_id_fkey");

            entity.HasOne(d => d.ContactType).WithMany(p => p.CompanyContacts)
                .HasForeignKey(d => d.ContactTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("company_contacts_contact_type_id_fkey");
        });

        modelBuilder.Entity<ContactType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("contact_types_pkey");

            entity.ToTable("contact_types", "mf");

            entity.HasIndex(e => e.Code, "contact_types_code_key").IsUnique();

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Code).HasColumnName("code");
            entity.Property(e => e.Name).HasColumnName("name");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("events_pkey");

            entity.ToTable("events", "mf");

            entity.HasIndex(e => new { e.EventTypeId, e.Year }, "uq_event_type_year").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.EndDate)
                .HasDefaultValueSql("CURRENT_DATE")
                .HasColumnName("end_date");
            entity.Property(e => e.EventTypeId).HasColumnName("event_type_id");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.StartDate)
                .HasDefaultValueSql("CURRENT_DATE")
                .HasColumnName("start_date");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("updated_at");
            entity.Property(e => e.Year).HasColumnName("year");

            entity.HasOne(d => d.EventType).WithMany(p => p.Events)
                .HasForeignKey(d => d.EventTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("events_event_type_id_fkey");
        });

        modelBuilder.Entity<EventTeamMember>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("event_team_members_pkey");

            entity.ToTable("event_team_members", "mf");

            entity.HasIndex(e => new { e.EventId, e.UserId, e.RoleId }, "uq_member_per_event").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.EventId).HasColumnName("event_id");
            entity.Property(e => e.ReportsToUserId).HasColumnName("reports_to_user_id");
            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Event).WithMany(p => p.EventTeamMembers)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("event_team_members_event_id_fkey");

            entity.HasOne(d => d.ReportsToUser).WithMany(p => p.EventTeamMemberReportsToUsers)
                .HasForeignKey(d => d.ReportsToUserId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("event_team_members_reports_to_user_id_fkey");

            entity.HasOne(d => d.Role).WithMany(p => p.EventTeamMembers)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("event_team_members_role_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.EventTeamMemberUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("event_team_members_user_id_fkey");
        });

        modelBuilder.Entity<EventType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("event_types_pkey");

            entity.ToTable("event_types", "mf");

            entity.HasIndex(e => e.Code, "event_types_code_key").IsUnique();

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Code).HasColumnName("code");
            entity.Property(e => e.Name).HasColumnName("name");
        });

        modelBuilder.Entity<OutreachStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("outreach_statuses_pkey");

            entity.ToTable("outreach_statuses", "mf");

            entity.HasIndex(e => e.Code, "outreach_statuses_code_key").IsUnique();

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Code).HasColumnName("code");
            entity.Property(e => e.Name).HasColumnName("name");
        });

        modelBuilder.Entity<OutreachTask>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("outreach_tasks_pkey");

            entity.ToTable("outreach_tasks", "mf");

            entity.HasIndex(e => new { e.EventId, e.ContactId }, "uq_task_per_event_contact").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AssignedToUserId).HasColumnName("assigned_to_user_id");
            entity.Property(e => e.CompanyId).HasColumnName("company_id");
            entity.Property(e => e.ContactId).HasColumnName("contact_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.EventId).HasColumnName("event_id");
            entity.Property(e => e.LastContactedAt).HasColumnName("last_contacted_at");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.ReminderSent)
                .HasDefaultValue(false)
                .HasColumnName("reminder_sent");
            entity.Property(e => e.ReminderSentAt).HasColumnName("reminder_sent_at");
            entity.Property(e => e.ResponsibleUserId).HasColumnName("responsible_user_id");
            entity.Property(e => e.StatusId).HasColumnName("status_id");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("updated_at");

            entity.HasOne(d => d.AssignedToUser).WithMany(p => p.OutreachTaskAssignedToUsers)
                .HasForeignKey(d => d.AssignedToUserId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("outreach_tasks_assigned_to_user_id_fkey");

            entity.HasOne(d => d.Company).WithMany(p => p.OutreachTasks)
                .HasForeignKey(d => d.CompanyId)
                .HasConstraintName("outreach_tasks_company_id_fkey");

            entity.HasOne(d => d.Contact).WithMany(p => p.OutreachTasks)
                .HasForeignKey(d => d.ContactId)
                .HasConstraintName("outreach_tasks_contact_id_fkey");

            entity.HasOne(d => d.Event).WithMany(p => p.OutreachTasks)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("outreach_tasks_event_id_fkey");

            entity.HasOne(d => d.ResponsibleUser).WithMany(p => p.OutreachTaskResponsibleUsers)
                .HasForeignKey(d => d.ResponsibleUserId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("outreach_tasks_responsible_user_id_fkey");

            entity.HasOne(d => d.Status).WithMany(p => p.OutreachTasks)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("outreach_tasks_status_id_fkey");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("roles_pkey");

            entity.ToTable("roles", "mf");

            entity.HasIndex(e => e.Code, "roles_code_key").IsUnique();

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Code).HasColumnName("code");
            entity.Property(e => e.Name).HasColumnName("name");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pkey");

            entity.ToTable("users", "mf");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.FirstName).HasColumnName("first_name");
            entity.Property(e => e.LastName).HasColumnName("last_name");
            entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("updated_at");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
